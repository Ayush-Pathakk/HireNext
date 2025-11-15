import React, { useState } from 'react';
import './FileUpload.css';

const FileUpload = ({ label, onUpload, currentImage, type = 'logo' }) => {
  const [preview, setPreview] = useState(currentImage || null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to backend
    setUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload(null);
  };

  return (
    <div className="file-upload-container">
      {label && <label className="form-label">{label}</label>}
      
      <div className="file-upload-box">
        {preview ? (
          <div className="file-preview">
            <img src={preview} alt="Preview" />
            <button
              type="button"
              className="remove-btn"
              onClick={handleRemove}
              disabled={uploading}
            >
              ×
            </button>
          </div>
        ) : (
          <label className="upload-placeholder">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div className="upload-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="17 8 12 3 7 8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="12" y1="3" x2="12" y2="15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="upload-text">
              <span style={{ color: '#2563eb', cursor: 'pointer' }}>Browse photo</span> or drop here
            </p>
            <p className="upload-hint">
              {type === 'logo' 
                ? 'A photo larger than 400 pixels work best. Max photo size 5 MB.'
                : 'Banner images optimal dimension 1520*400. Supported format JPEG, PNG. Max photo size 5 MB.'}
            </p>
          </label>
        )}
        
        {uploading && (
          <div className="uploading-overlay">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;