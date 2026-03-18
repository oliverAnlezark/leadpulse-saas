# Bulk Lead Import Guide

## Overview

LeadPulse now supports importing multiple leads at once from Excel or CSV files. This feature allows you to quickly populate your leads pipeline with contact lists from your CRM, spreadsheets, or other sources.

## Supported File Formats

- **CSV** (.csv) - Comma-separated values
- **Excel** (.xlsx) - Modern Excel format
- **Excel** (.xls) - Legacy Excel format

Maximum file size: **10MB**

## File Format Requirements

Your file must include the following columns:

| Column | Required | Description | Example |
|--------|----------|-------------|---------|
| **Full Name** | ✅ Yes | Contact's full name | John Smith |
| **Address** | ❌ Optional | Property address or location | 123 Main St, Sydney NSW 2000 |
| **Phone** | ⚠️ One of these | Phone number | 0400 000 000 |
| **Email** | ⚠️ One of these | Email address | john@example.com |
| **Notes** | ❌ Optional | Additional notes or comments | Interested in 3BR house |

**Important:** Each lead must have:
- A **Full Name** (required)
- Either a **Phone** or **Email** (at least one is required)

## Supported Column Name Variations

The import feature is flexible and recognizes various column name formats:

| Field | Recognized Names |
|-------|------------------|
| Full Name | "Full Name", "Name", "Contact Name", "Fullname" |
| First Name | "First Name", "FirstName", "First" |
| Last Name | "Last Name", "LastName", "Last" |
| Address | "Address", "Street", "Property Address", "Location" |
| Phone | "Phone", "Phone Number", "Mobile", "Tel", "Telephone" |
| Email | "Email", "Email Address", "Mail", "E-mail" |
| Notes | "Notes", "Comments", "Remarks", "Description" |

## How to Use

### Step 1: Prepare Your File

Create a CSV or Excel file with your contacts. Example:

```
Full Name,Address,Phone,Email,Notes
Sue Lawlor,42 Lindsay Street East Maitland,0427 331 018,,LAP on 07/10/2025 - Slow burner, call new year
Mel Rossi & Ashley Bennett,103 Shyan Street Morpeth,0413 534 544,0400 258 088,Selling - wants 250k+ - App booked with tenants for 30/04/24
Michael Percival,28 Grasshawk Drive Chisholm,0424 509 397,,michaelp@ntbpc.com.au,Daughters bday party on 15/03
Margaret Bell,42 Brokenback Road Brampton,02 4938 3534,,Totally just turned - "house is a mess" - call Monday to see if she wants it
```

### Step 2: Download Template (Optional)

1. Go to **Import** page in LeadPulse
2. Click **Download Template** button
3. This gives you a pre-formatted CSV file to fill in

### Step 3: Upload Your File

1. Go to **Import** page in LeadPulse (from sidebar)
2. **Drag and drop** your file onto the upload area, OR
3. **Click** the upload area to browse and select your file
4. Click **Import Leads** button

### Step 4: Review Results

After upload, you'll see:
- ✅ Number of leads successfully imported
- ⚠️ Number of rows skipped (with reasons)
- 📊 Summary of import results

### Step 5: Check Your Leads

1. Go to **Leads** page
2. Your newly imported leads will appear with status **"new"**
3. They're ready for AI response and follow-up sequences!

## Data Validation

The import feature validates each row:

| Validation | Error | Solution |
|-----------|-------|----------|
| Missing name | "Missing name" | Add a value in the Full Name column |
| No phone or email | "Missing email or phone" | Add at least one contact method |
| Invalid file type | "Only CSV and Excel files allowed" | Use .csv, .xlsx, or .xls format |
| File too large | "File size must be less than 10MB" | Reduce file size or split into multiple files |

## Import Behavior

### What Happens to Each Lead

1. **Name Parsing**
   - If "Full Name" is provided, it's split into first and last name
   - If only "First Name" is provided, "Last Name" defaults to "Lead"
   - If no name, the row is skipped

2. **Contact Information**
   - Phone and email are stored as-is
   - If only one is provided, the other is left blank
   - Both are optional as long as one is provided

3. **Lead Status**
   - All imported leads start with status: **"new"**
   - Lead source is set to: **"bulk_import"**
   - You can manually change status in the Leads page

4. **Duplicate Handling**
   - Currently, no duplicate checking is performed
   - If you import the same contact twice, they'll appear as separate leads
   - **Recommendation:** Clean your source file before importing

## Examples

### Example 1: Minimal Import
```
Full Name,Phone
John Smith,0400 000 000
Jane Doe,0411 111 111
```

### Example 2: Complete Import
```
Full Name,Address,Phone,Email,Notes
John Smith,123 Main St Sydney,0400 000 000,john@example.com,Interested in 3BR
Jane Doe,456 Oak Ave Melbourne,0411 111 111,jane@example.com,Looking to sell
```

### Example 3: Mixed Data
```
Full Name,Address,Phone,Email,Notes
John Smith,123 Main St,0400 000 000,,Buying first home
Jane Doe,456 Oak Ave,,jane@example.com,Selling ASAP
Bob Johnson,789 Pine Rd,0422 222 222,bob@example.com,
```

## Troubleshooting

### "File size must be less than 10MB"
- Your file is too large
- **Solution:** Split the file into multiple smaller files and import separately

### "Only CSV and Excel files allowed"
- Your file format is not supported
- **Solution:** Save your file as .csv or .xlsx format

### "No valid records to import"
- All rows in your file failed validation
- **Solution:** Check that each row has:
  - A Full Name value
  - Either a Phone or Email value

### Some rows were skipped
- Some rows had validation errors
- **Solution:** Check the error messages shown after import
- Fix those rows and re-import

### Leads not appearing after import
- The import may have failed silently
- **Solution:**
  1. Check the import results page for error messages
  2. Try uploading a smaller test file first
  3. Verify your file format is correct

## Best Practices

1. **Clean Your Data First**
   - Remove duplicate entries
   - Fix obvious typos in names
   - Ensure phone numbers are in a consistent format

2. **Test with a Small File**
   - Try importing 5-10 leads first
   - Verify they appear correctly in the Leads page
   - Then import your full list

3. **Use Consistent Formatting**
   - Phone: Use consistent format (e.g., 0400 000 000)
   - Email: Ensure valid email format
   - Names: Use proper capitalization

4. **Keep Your Source File**
   - Don't delete your original file after import
   - You may need to re-import if there are issues
   - Useful for auditing what was imported

5. **Monitor Import Results**
   - Always review the import summary
   - Check for any skipped rows
   - Verify leads appear in the Leads page

## Limits & Performance

- **Maximum file size:** 10MB
- **Maximum rows per file:** ~50,000 (depends on data size)
- **Import speed:** ~100-500 leads per second
- **Typical import time:** 5-30 seconds for 1,000 leads

## API Reference

### POST /api/import/leads

Upload and import leads from a file.

**Request:**
```
POST /api/import/leads
Content-Type: multipart/form-data

file: <CSV or Excel file>
```

**Response (201 Created):**
```json
{
  "message": "Successfully imported 50 leads",
  "importedCount": 50,
  "totalRecords": 52,
  "validRecords": 50,
  "errors": [
    { "row": 2, "error": "Missing name" },
    { "row": 45, "error": "Missing email or phone" }
  ],
  "leads": [
    {
      "id": 123,
      "first_name": "John",
      "last_name": "Smith",
      "email": "john@example.com",
      "phone": "0400 000 000"
    }
  ]
}
```

### GET /api/import/template

Download a CSV template for bulk import.

**Request:**
```
GET /api/import/template
```

**Response:**
```
Full Name,Address,Phone,Email,Notes
John Smith,123 Main St Sydney NSW 2000,0400 000 000,john@example.com,Interested in 3BR house
Jane Doe,456 Oak Ave Melbourne VIC 3000,0411 111 111,jane@example.com,Looking to sell ASAP
Bob Johnson,789 Pine Rd Brisbane QLD 4000,0422 222 222,,Buying first home
```

## Next Steps

After importing leads:

1. **Review the Leads page** to see your imported contacts
2. **Set up follow-up sequences** to automate outreach
3. **Configure AI responses** to send instant replies
4. **Monitor analytics** to track conversion rates

## Support

For issues or questions:
- Check the troubleshooting section above
- Review the import results for specific error messages
- Verify your file format matches the requirements
- Contact LeadPulse support if problems persist
