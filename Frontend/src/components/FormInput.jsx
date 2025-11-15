import React from 'react';

const FormInput = ({ label, name, type = 'text', value, onChange, error, placeholder, required = false }) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span style={{ color: '#dc2626' }}>*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-input"
        required={required}
      />
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default FormInput;