import React from 'react';
import { getDisplayValue } from '../utils/numericEngine';

function AluPanel({ aluA, setAluA, aluB, setAluB, aluOp, setAluOp, aluData, wordSize, compactView }) {
  return (
    <div className="lab-panel">
      <div className="panel-header">
        <h2 style={{ fontSize: '14px', margin: 0 }}>Capa de Aritmética Lógica (ALU Simulator)</h2>
        <span className="register-label" style={{ backgroundColor: 'var(--accent-magenta)', color: '#fff' }}>
          Fase 3
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="alu-operand-a">Operando A (Binario)</label>
          <input
            id="alu-operand-a"
            type="text"
            value={aluA}
            onChange={(e) => setAluA(e.target.value)}
            className="form-control"
            placeholder="Ej. 1010..."
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="alu-operand-b">Operando B (Binario)</label>
          <input
            id="alu-operand-b"
            type="text"
            value={aluB}
            onChange={(e) => setAluB(e.target.value)}
            className="form-control"
            placeholder="Ej. 1100..."
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="alu-operator">Operador Lógico</label>
          <select
            id="alu-operator"
            value={aluOp}
            onChange={(e) => setAluOp(e.target.value)}
            className="form-control"
            style={{ cursor: 'pointer' }}
          >
            <option value="AND">AND (Conjunción)</option>
            <option value="OR">OR (Disyunción)</option>
            <option value="XOR">XOR (Exclusivo)</option>
          </select>
        </div>
      </div>

      {aluData.error ? (
        <div className="alert-box" style={{ backgroundColor: 'var(--accent-magenta)' }}>
          <span>⚠ ERROR ALU: {aluData.error}</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>

          {/* ALU Bit grid comparison display */}
          <div>
            <label className="form-label">Comparación Bit-a-Bit en ALU ({wordSize} bits)</label>
            <div className="alu-bit-grid">
              {/* Operand A Row */}
              <div className="alu-bit-row">
                <div className="alu-row-header">Reg A (Binario):</div>
                {aluData.padA.split('').map((bit, idx) => (
                  <div key={`A-${idx}`} className={`alu-bit-cell ${bit === '1' ? 'highlight-cyan' : ''}`}>
                    {bit}
                  </div>
                ))}
              </div>
              {/* Operand B Row */}
              <div className="alu-bit-row" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '4px', marginBottom: '4px' }}>
                <div className="alu-row-header">Reg B (Binario):</div>
                {aluData.padB.split('').map((bit, idx) => (
                  <div key={`B-${idx}`} className={`alu-bit-cell ${bit === '1' ? 'highlight-cyan' : ''}`}>
                    {bit}
                  </div>
                ))}
              </div>
              {/* Result Row */}
              <div className="alu-bit-row">
                <div className="alu-row-header">Resultado ALU:</div>
                {aluData.resultBin.split('').map((bit, idx) => (
                  <div key={`Res-${idx}`} className={`alu-bit-cell ${bit === '1' ? 'highlight-green' : ''}`}>
                    {bit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ALU Outputs display */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
            <div style={{ border: '1px solid var(--border-muted)', padding: '10px', backgroundColor: 'var(--bg-secondary)' }}>
              <span className="form-label" style={{ fontSize: '9px' }}>ALU Binario</span>
              <div style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '13px', marginTop: '4px' }}>
                {getDisplayValue(aluData.resultBin, !!aluData.error, compactView)}
              </div>
            </div>
            <div style={{ border: '1px solid var(--border-muted)', padding: '10px', backgroundColor: 'var(--bg-secondary)' }}>
              <span className="form-label" style={{ fontSize: '9px' }}>ALU Decimal</span>
              <div style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '13px', marginTop: '4px' }}>
                {aluData.decResult}
              </div>
            </div>
            <div style={{ border: '1px solid var(--border-muted)', padding: '10px', backgroundColor: 'var(--bg-secondary)' }}>
              <span className="form-label" style={{ fontSize: '9px' }}>ALU Hexadecimal</span>
              <div style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '13px', marginTop: '4px' }}>
                0x{getDisplayValue(aluData.hexResult, !!aluData.error, compactView)}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default AluPanel;
