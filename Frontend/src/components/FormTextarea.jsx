import React from 'react';

const FormTextarea = ({ label, name, value, onChange, error, placeholder, rows = 4, required = false }) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="form-textarea"
        required={required}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default FormTextarea;