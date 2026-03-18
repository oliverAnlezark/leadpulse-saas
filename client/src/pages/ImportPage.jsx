import { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, Download, Loader } from 'lucide-react';

export default function ImportPage() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    
    const isValidType = validTypes.includes(selectedFile.type) || 
                       validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));
    
    if (!isValidType) {
      setError('Please upload a CSV or Excel file');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/import/leads', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Upload failed');
        setResult(null);
        return;
      }

      setResult(data);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.message || 'Upload failed');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    window.location.href = '/api/import/template';
  };

  const resetForm = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
        borderRadius: '16px',
        padding: '40px',
        marginBottom: '40px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(124, 58, 237, 0.2)'
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
          Bulk Lead Import
        </h1>
        <p style={{ fontSize: '16px', opacity: 0.95, margin: 0 }}>
          Upload your contact list to add multiple leads to LeadPulse instantly
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Instructions */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          border: '1px solid #e5e7eb'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginTop: 0, marginBottom: '16px' }}>
            📋 Supported Format
          </h2>
          <p style={{ margin: '0 0 12px 0', color: '#666' }}>
            Upload a CSV or Excel file with the following columns:
          </p>
          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '12px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '13px',
            color: '#374151',
            marginBottom: '16px'
          }}>
            Full Name | Address | Phone | Email | Notes
          </div>
          <p style={{ margin: '0 0 12px 0', color: '#666', fontSize: '14px' }}>
            <strong>Required:</strong> Full Name + (Email or Phone)
          </p>
          <button
            onClick={downloadTemplate}
            style={{
              backgroundColor: '#f3f4f6',
              border: '1px solid #d1d5db',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#f3f4f6'}
          >
            <Download size={16} />
            Download Template
          </button>
        </div>

        {/* Upload Area */}
        {!result && (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: isDragging ? '2px solid #7c3aed' : '2px dashed #d1d5db',
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
              backgroundColor: isDragging ? '#f5f3ff' : '#fafbfc',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginBottom: '24px'
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            <Upload size={48} style={{ color: '#7c3aed', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>
              {file ? file.name : 'Drop your file here'}
            </h3>
            <p style={{ color: '#666', margin: '0 0 16px 0', fontSize: '14px' }}>
              or click to browse (CSV or Excel)
            </p>
            <p style={{ color: '#999', margin: 0, fontSize: '12px' }}>
              Maximum file size: 10MB
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }} />
            <div>
              <p style={{ margin: 0, fontWeight: '600', color: '#dc2626' }}>Error</p>
              <p style={{ margin: '4px 0 0 0', color: '#991b1b', fontSize: '14px' }}>{error}</p>
            </div>
          </div>
        )}

        {/* Success Result */}
        {result && (
          <div style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
              <CheckCircle size={24} style={{ color: '#16a34a', flexShrink: 0 }} />
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#15803d' }}>
                  Import Successful!
                </h3>
                <p style={{ margin: '8px 0 0 0', color: '#166534', fontSize: '14px' }}>
                  {result.importedCount} out of {result.totalRecords} leads imported
                </p>
              </div>
            </div>

            {result.errors && result.errors.length > 0 && (
              <div style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #fcd34d',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '16px'
              }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#92400e', fontSize: '13px' }}>
                  {result.errors.length} rows skipped:
                </p>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#b45309', fontSize: '13px' }}>
                  {result.errors.slice(0, 5).map((err, idx) => (
                    <li key={idx}>Row {err.row}: {err.error}</li>
                  ))}
                  {result.errors.length > 5 && (
                    <li>... and {result.errors.length - 5} more</li>
                  )}
                </ul>
              </div>
            )}

            <div style={{
              backgroundColor: '#ecfdf5',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#047857' }}>
                <strong>✓ Imported Leads:</strong> {result.importedCount}
              </p>
            </div>

            <button
              onClick={resetForm}
              style={{
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#15803d'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#16a34a'}
            >
              Import Another File
            </button>
          </div>
        )}

        {/* Upload Button */}
        {file && !result && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleUpload}
              disabled={isLoading}
              style={{
                backgroundColor: '#7c3aed',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: isLoading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#6d28d9')}
              onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#7c3aed')}
            >
              {isLoading ? (
                <>
                  <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Import Leads
                </>
              )}
            </button>
            <button
              onClick={resetForm}
              disabled={isLoading}
              style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                border: '1px solid #d1d5db',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                opacity: isLoading ? 0.7 : 1,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => !isLoading && (e.target.style.backgroundColor = '#e5e7eb')}
              onMouseLeave={(e) => !isLoading && (e.target.style.backgroundColor = '#f3f4f6')}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Loading Animation */}
        {isLoading && (
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        )}
      </div>
    </div>
  );
}
