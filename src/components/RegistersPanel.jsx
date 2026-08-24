import React from 'react';
import RegisterField from './RegisterField';

function RegistersPanel({ conversionData, compactView, setCompactView }) {
  return (
    <div className="lab-panel panel-registers">
      <div className="panel-header">
        <h2>Módulo de Salida Multibase (Registros)</h2>
        <label
          htmlFor="compact-view-toggle"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', userSelect: 'none' }}
        >
          <input
            id="compact-view-toggle"
            type="checkbox"
            checked={compactView}
            onChange={(e) => setCompactView(e.target.checked)}
            style={{ accentColor: '#000000', width: '15px', height: '15px', cursor: 'pointer' }}
          />
          Vista compacta (sin ceros de relleno)
        </label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Binary display */}
        <RegisterField
          label="Registro Binario (Base 2)"
          value={conversionData.outputs.binary}
          hasError={!!conversionData.error}
          compactView={compactView}
        />

        {/* Octal display */}
        <RegisterField
          label="Registro Octal (Base 8)"
          value={conversionData.outputs.octal}
          hasError={!!conversionData.error}
          compactView={compactView}
        />

        {/* Decimal display */}
        <RegisterField
          label="Registro Decimal (Base 10)"
          value={conversionData.outputs.decimal}
          hasError={!!conversionData.error}
          compactView={compactView}
        />

        {/* Hexadecimal display */}
        <RegisterField
          label="Registro Hexadecimal (Base 16)"
          value={conversionData.outputs.hexadecimal}
          hasError={!!conversionData.error}
          compactView={compactView}
          prefix="0x"
        />
      </div>
    </div>
  );
}

export default RegistersPanel;
