import express from 'express';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { query } from '../db.js';

const router = express.Router();

// Configure multer for file uploads (10MB limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedMimes.includes(file.mimetype) || 
        file.originalname.endsWith('.csv') || 
        file.originalname.endsWith('.xlsx') ||
        file.originalname.endsWith('.xls')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and Excel files are allowed'));
    }
  }
});

/**
 * Parse CSV file
 */
function parseCSV(buffer) {
  const content = buffer.toString('utf-8');
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true
  });
}

/**
 * Parse Excel file
 */
function parseExcel(buffer) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
  return data;
}

/**
 * Normalize column names to match expected fields
 */
function normalizeColumns(records) {
  return records.map(record => {
    const normalized = {};
    
    // Map various column name variations to standard fields
    Object.keys(record).forEach(key => {
      const lowerKey = key.toLowerCase().trim();
      
      if (lowerKey.includes('name') || lowerKey.includes('full')) {
        normalized.fullName = record[key];
      } else if (lowerKey.includes('first')) {
        normalized.firstName = record[key];
      } else if (lowerKey.includes('last')) {
        normalized.lastName = record[key];
      } else if (lowerKey.includes('address') || lowerKey.includes('street')) {
        normalized.address = record[key];
      } else if (lowerKey.includes('phone') || lowerKey.includes('mobile') || lowerKey.includes('tel')) {
        normalized.phone = record[key];
      } else if (lowerKey.includes('email') || lowerKey.includes('mail')) {
        normalized.email = record[key];
      } else if (lowerKey.includes('note') || lowerKey.includes('comment') || lowerKey.includes('remark')) {
        normalized.notes = record[key];
      } else if (lowerKey.includes('property') || lowerKey.includes('interest')) {
        normalized.propertyInterest = record[key];
      } else if (lowerKey.includes('budget')) {
        normalized.budget = record[key];
      } else if (lowerKey.includes('timeline')) {
        normalized.timeline = record[key];
      }
    });
    
    return normalized;
  });
}

/**
 * Parse full name into first and last name
 */
function parseFullName(fullName) {
  if (!fullName) return { firstName: 'Unknown', lastName: 'Lead' };
  
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: 'Lead' };
  }
  
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  };
}

/**
 * POST /api/import/leads
 * Upload and import leads from CSV or Excel file
 */
router.post('/leads', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Get agent ID from auth (assuming middleware sets this)
    // For now, we'll use agent_id from request body or default to 1
    const agentId = req.body.agentId || req.user?.id || 1;

    let records = [];

    // Parse file based on type
    if (req.file.originalname.endsWith('.csv')) {
      records = parseCSV(req.file.buffer);
    } else if (req.file.originalname.endsWith('.xlsx') || req.file.originalname.endsWith('.xls')) {
      records = parseExcel(req.file.buffer);
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    if (records.length === 0) {
      return res.status(400).json({ error: 'No records found in file' });
    }

    // Normalize column names
    const normalizedRecords = normalizeColumns(records);

    // Validate and prepare records
    const validRecords = [];
    const errors = [];

    normalizedRecords.forEach((record, index) => {
      const rowNum = index + 2; // +2 because row 1 is header, +1 for 1-based indexing

      // Parse full name if provided
      let firstName = record.firstName;
      let lastName = record.lastName;

      if (record.fullName && !firstName) {
        const parsed = parseFullName(record.fullName);
        firstName = parsed.firstName;
        lastName = parsed.lastName;
      }

      // Validate required fields
      if (!firstName && !record.fullName) {
        errors.push({ row: rowNum, error: 'Missing name' });
        return;
      }

      // At least one contact method required
      if (!record.email && !record.phone) {
        errors.push({ row: rowNum, error: 'Missing email or phone' });
        return;
      }

      validRecords.push({
        agentId,
        firstName: firstName || 'Unknown',
        lastName: lastName || 'Lead',
        email: record.email || null,
        phone: record.phone || null,
        propertyInterest: record.address || record.propertyInterest || null,
        timeline: record.timeline || null,
        leadSource: 'bulk_import',
        leadStatus: 'new',
        notes: record.notes || null
      });
    });

    if (validRecords.length === 0) {
      return res.status(400).json({
        error: 'No valid records to import',
        errors
      });
    }

    // Bulk insert records
    let createdCount = 0;
    const createdLeads = [];

    try {
      for (const record of validRecords) {
        const result = await query(
          `INSERT INTO leads (
            agent_id, first_name, last_name, email, phone,
            property_interest, timeline, lead_source, lead_status,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
          RETURNING id, first_name, last_name, email, phone`,
          [
            record.agentId,
            record.firstName,
            record.lastName,
            record.email,
            record.phone,
            record.propertyInterest,
            record.timeline,
            record.leadSource,
            record.leadStatus
          ]
        );

        if (result.rows[0]) {
          createdCount++;
          createdLeads.push(result.rows[0]);
        }
      }
    } catch (dbError) {
      console.error('[Import] Database error:', dbError);
      return res.status(500).json({ error: 'Database error during import' });
    }

    return res.status(201).json({
      message: `Successfully imported ${createdCount} leads`,
      importedCount: createdCount,
      totalRecords: normalizedRecords.length,
      validRecords: validRecords.length,
      errors,
      leads: createdLeads
    });
  } catch (error) {
    console.error('[Import] Error:', error);
    return res.status(500).json({
      error: 'Failed to process import',
      message: error.message
    });
  }
});

/**
 * GET /api/import/template
 * Download CSV template for bulk import
 */
router.get('/template', (req, res) => {
  const template = `Full Name,Address,Phone,Email,Notes
John Smith,123 Main St Sydney NSW 2000,0400 000 000,john@example.com,Interested in 3BR house
Jane Doe,456 Oak Ave Melbourne VIC 3000,0411 111 111,jane@example.com,Looking to sell ASAP
Bob Johnson,789 Pine Rd Brisbane QLD 4000,0422 222 222,,Buying first home`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="leadpulse-import-template.csv"');
  res.send(template);
});

export default router;
