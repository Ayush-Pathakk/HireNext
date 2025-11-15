import React from 'react';

const FormSelect = ({ label, name, value, onChange, options, error, placeholder, required = false }) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label" htmlFor={name}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-select ${error ? 'error' : ''}`}
        required={required}
      >
        <option value="">{placeholder || 'Select an option'}</option>
        {options.map((option, index) => (
          <option key={`${name}-${index}`} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default FormSelect;