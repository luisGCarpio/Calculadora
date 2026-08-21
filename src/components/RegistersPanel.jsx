import React from 'react';
import RegisterField from './RegisterField';

function RegistersPanel({ conversionData, compactView, setCompactView, copyToClipboard }) {
  return (
    <div className="lab-panel">
      <div className="panel-header">
        <h2 style={{ fontSize: '14px', margin: 0 }}>Módulo de Salida Multibase (Registros)</h2>
        <label
          htmlFor="compact-view-toggle"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', userSelect: 'none' }}
        >
          <input
            id="compact-view-toggle"
            type="checkbox"
            checked={compactView}
            onChange={(e) => setCompactView(e.target.checked)}
            style={{ accentColor: 'var(--accent-cyan)', width: '13px', height: '13px', cursor: 'pointer' }}
          />
          Vista compacta (sin ceros de relleno)
        </label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Binary display */}
        <RegisterField
          label="Registro Binario (Base 2)"
          value={conversionData.outputs.binary}
          hasError={!!conversionData.error}
          compactView={compactView}
          onCopy={copyToClipboard}
        />

        {/* Octal display */}
        <RegisterField
          label="Registro Octal (Base 8)"
          value={conversionData.outputs.octal}
          hasError={!!conversionData.error}
          compactView={compactView}
          onCopy={copyToClipboard}
        />

        {/* Decimal display */}
        <div>
          <label className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Registro Decimal (Base 10)</label>
          <div className="register-display">
            <span>{conversionData.error ? '---------' : conversionData.outputs.decimal}</span>
            <button 
              onClick={() => copyToClipboard(conversionData.outputs.decimal)}
              disabled={!!conversionData.error}
              className="action-button" 
              style={{ padding: '2px 8px', fontSize: '10px' }}
            >
              Copiar
            </button>
          </div>
        </div>

        {/* Hexadecimal display */}
        <RegisterField
          label="Registro Hexadecimal (Base 16)"
          value={conversionData.outputs.hexadecimal}
          hasError={!!conversionData.error}
          compactView={compactView}
          prefix="0x"
          onCopy={copyToClipboard}
        />
      </div>
    </div>
  );
}

export default RegistersPanel;
