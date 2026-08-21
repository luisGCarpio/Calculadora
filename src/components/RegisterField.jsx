import React from 'react';
import { getDisplayValue } from '../utils/numericEngine';

function RegisterField({ label, value, hasError, compactView, prefix = '', onCopy }) {
  const displayValue = getDisplayValue(value, hasError, compactView);
  const finalValue = prefix ? `${prefix}${displayValue}` : displayValue;

  return (
    <div>
      <label className="form-label" style={{ display: 'block', marginBottom: '4px' }}>{label}</label>
      <div className="register-display">
        <span>{finalValue}</span>
        <button
          onClick={() => onCopy(finalValue)}
          disabled={hasError}
          className="action-button"
          style={{ padding: '2px 8px', fontSize: '10px' }}
        >
          Copiar
        </button>
      </div>
    </div>
  );
}

export default RegisterField;
