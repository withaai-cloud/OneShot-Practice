import React, { useState } from 'react';
import './StatutoryDocuments.css';

function StatutoryDocuments({ client, onBack }) {
  const [documents, setDocuments] = useState([
    // Demo documents
    {
      id: 1,
      name: 'Company Registration Certificate',
      fileName: 'registration_cert.pdf',
      fileType: 'application/pdf',
      uploadDate: '2024-01-15',
      uploadedBy: 'super@oneshot.co.za',
      fileSize: '245 KB',
      fileData: null
    },
    {
      id: 2,
      name: 'Annual Financial Statements 2023',
      fileName: 'afs_2023.pdf',
      fileType: 'application/pdf',
      uploadDate: '2024-03-20',
      uploadedBy: 'accounting@oneshot.co.za',
      fileSize: '1.2 MB',
      fileData: null
    },
    {
      id: 3,
      name: 'Tax Clearance Certificate',
      fileName: 'tax_clearance.pdf',
      fileType: 'application/pdf',
      uploadDate: '2024-02-10',
      uploadedBy: 'super@oneshot.co.za',
      fileSize: '180 KB',
      fileData: null
    }
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    documentName: '',
    file: null
  });
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, name-asc, name-desc

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please upload PDF, Image (JPG/PNG), or Excel files only.');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      setUploadForm({
        ...uploadForm,
        file: file
      });
    }
  };

  // Handle upload
  const handleUpload = () => {
    if (!uploadForm.documentName || !uploadForm.file) {
      alert('Please provide a document name and select a file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const newDocument = {
        id: Date.now(),
        name: uploadForm.documentName,
        fileName: uploadForm.file.name,
        fileType: uploadForm.file.type,
        uploadDate: new Date().toISOString().split('T')[0],
        uploadedBy: 'current.user@email.com',
        fileSize: formatFileSize(uploadForm.file.size),
        fileData: e.target.result
      };

      setDocuments([...documents, newDocument]);
      setShowUploadModal(false);
      setUploadForm({ documentName: '', file: null });
    };
    reader.readAsDataURL(uploadForm.file);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Get file icon based on type
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    return '📎';
  };

  // Handle download
  const handleDownload = (document) => {
    if (document.fileData) {
      const link = window.document.createElement('a');
      link.href = document.fileData;
      link.download = document.fileName;
      link.click();
    } else {
      alert('File data not available');
    }
  };

  // Handle view
  const handleView = (document) => {
    setSelectedDocument(document);
  };

  // Handle delete
  const handleDelete = (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter(doc => doc.id !== documentId));
    }
  };

  // Filter and sort documents
  const getFilteredAndSortedDocuments = () => {
    let filtered = documents;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch(sortBy) {
        case 'date-desc':
          return new Date(b.uploadDate) - new Date(a.uploadDate);
        case 'date-asc':
          return new Date(a.uploadDate) - new Date(b.uploadDate);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return sorted;
  };

  const filteredDocuments = getFilteredAndSortedDocuments();

  return (
    <div className="statutory-documents">
      {/* Header */}
      <div className="module-header">
        <div className="header-content">
          <button className="back-btn" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <div className="module-title">
            <h1>📋 Statutory Documents</h1>
            <p className="client-name">{client.name}</p>
          </div>
        </div>
        <button className="upload-btn" onClick={() => setShowUploadModal(true)}>
          ⬆️ Upload Document
        </button>
      </div>

      {/* Search and Sort Bar */}
      <div className="toolbar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="sort-container">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="documents-container">
        {filteredDocuments.length === 0 ? (
          <div className="no-documents">
            <div className="no-docs-icon">📋</div>
            <h2>{searchTerm ? 'No Documents Found' : 'No Documents Yet'}</h2>
            <p>{searchTerm ? 'Try a different search term' : 'Upload your first statutory document using the button above.'}</p>
          </div>
        ) : (
          <div className="documents-list">
            <div className="list-header">
              <div className="col-icon"></div>
              <div className="col-name">Document Name</div>
              <div className="col-file">File Name</div>
              <div className="col-size">Size</div>
              <div className="col-date">Upload Date</div>
              <div className="col-actions">Actions</div>
            </div>
            {filteredDocuments.map(doc => (
              <div key={doc.id} className="document-row">
                <div className="col-icon">
                  <span className="file-icon">{getFileIcon(doc.fileType)}</span>
                </div>
                <div className="col-name">
                  <span className="doc-name">{doc.name}</span>
                </div>
                <div className="col-file">
                  <span className="file-name">{doc.fileName}</span>
                </div>
                <div className="col-size">
                  <span className="file-size">{doc.fileSize}</span>
                </div>
                <div className="col-date">
                  <span className="upload-date">{new Date(doc.uploadDate).toLocaleDateString('en-ZA')}</span>
                </div>
                <div className="col-actions">
                  <button 
                    className="action-btn view-btn" 
                    onClick={() => handleView(doc)}
                    title="View"
                  >
                    👁️
                  </button>
                  <button 
                    className="action-btn download-btn" 
                    onClick={() => handleDownload(doc)}
                    title="Download"
                  >
                    ⬇️
                  </button>
                  <button 
                    className="action-btn delete-btn" 
                    onClick={() => handleDelete(doc.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="upload-modal-overlay">
          <div className="upload-modal">
            <div className="modal-header">
              <h2>Upload Document</h2>
              <button className="close-btn" onClick={() => setShowUploadModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Document Name *</label>
                <input
                  type="text"
                  value={uploadForm.documentName}
                  onChange={(e) => setUploadForm({ ...uploadForm, documentName: e.target.value })}
                  placeholder="e.g., Annual Financial Statements 2024"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Select File *</label>
                <div className="file-input-container">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".pdf,.jpg,.jpeg,.png,.xls,.xlsx"
                    className="file-input"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="file-input-label">
                    {uploadForm.file ? uploadForm.file.name : 'Choose File'}
                  </label>
                </div>
                <small className="help-text">
                  Accepted: PDF, Images (JPG, PNG), Excel files. Max size: 10MB
                </small>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowUploadModal(false)}>
                Cancel
              </button>
              <button className="submit-btn" onClick={handleUpload}>
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedDocument && (
        <div className="view-modal-overlay" onClick={() => setSelectedDocument(null)}>
          <div className="view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedDocument.name}</h2>
              <button className="close-btn" onClick={() => setSelectedDocument(null)}>✕</button>
            </div>
            <div className="modal-body">
              {selectedDocument.fileType.includes('pdf') && selectedDocument.fileData && (
                <iframe
                  src={selectedDocument.fileData}
                  title={selectedDocument.name}
                  className="pdf-viewer"
                />
              )}
              {selectedDocument.fileType.includes('image') && selectedDocument.fileData && (
                <img
                  src={selectedDocument.fileData}
                  alt={selectedDocument.name}
                  className="image-viewer"
                />
              )}
              {(selectedDocument.fileType.includes('excel') || selectedDocument.fileType.includes('spreadsheet')) && (
                <div className="excel-placeholder">
                  <p>📊 Excel files cannot be previewed.</p>
                  <button className="download-preview-btn" onClick={() => handleDownload(selectedDocument)}>
                    Download to View
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatutoryDocuments;