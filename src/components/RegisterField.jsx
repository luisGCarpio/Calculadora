import React from 'react';
import { getDisplayValue } from '../utils/numericEngine';

function RegisterField({ label, value, hasError, compactView, prefix = '' }) {
  const displayValue = getDisplayValue(value, hasError, compactView);
  const finalValue = prefix ? `${prefix}${displayValue}` : displayValue;

  return (
    <div>
      <label className="form-label" style={{ display: 'block', marginBottom: '6px' }}>{label}</label>
      <div className="register-display" style={{ minHeight: '46px', width: '100%' }}>
        <span>{hasError ? '---------' : finalValue}</span>
      </div>
    </div>
  );
}

export default RegisterField;
