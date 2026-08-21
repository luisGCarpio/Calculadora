import React from 'react';
import { getArchitectureLimit, decimalToAnyBase } from '../utils/numericEngine';

function InputModule({ inputNum, setInputNum, inputBase, setInputBase, wordSize, setWordSize, conversionData }) {
  return (
    <div className="lab-panel">
      <div className="panel-header">
        <h2 style={{ fontSize: '14px', margin: 0 }}>Módulo de Entrada de Datos</h2>
        <span className="register-label" style={{ backgroundColor: 'var(--accent-cyan)', color: '#000' }}>
          Fase 1 y 2
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="input-num">Número a Procesar</label>
          <input
            id="input-num"
            type="text"
            value={inputNum}
            onChange={(e) => setInputNum(e.target.value)}
            className="form-control"
            placeholder="Ingrese valor..."
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="input-base">Base de Origen</label>
          <select
            id="input-base"
            value={inputBase}
            onChange={(e) => setInputBase(parseInt(e.target.value))}
            className="form-control"
            style={{ cursor: 'pointer' }}
          >
            <option value={2}>Binario (Base 2)</option>
            <option value={8}>Octal (Base 8)</option>
            <option value={10}>Decimal (Base 10)</option>
            <option value={16}>Hexadecimal (Base 16)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="word-size">Tamaño de Palabra (Arquitectura)</label>
          <select
            id="word-size"
            value={wordSize}
            onChange={(e) => setWordSize(parseInt(e.target.value))}
            className="form-control"
            style={{ cursor: 'pointer' }}
          >
            <option value={8}>8 bits (Byte)</option>
            <option value={16}>16 bits (Word)</option>
            <option value={32}>32 bits (DWord)</option>
            <option value={64}>64 bits (QWord)</option>
          </select>
        </div>
      </div>

      {/* Error or Limit info */}
      {conversionData.error ? (
        <div className="alert-box">
          <span>⚠ ERROR: {conversionData.error}</span>
        </div>
      ) : (
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-muted)', paddingTop: '10px' }}>
          Máscara activa para {wordSize} bits. Límite máximo del registro: 
          <strong style={{ color: 'var(--text-primary)' }}> {getArchitectureLimit(wordSize).toString()} (0x{decimalToAnyBase(getArchitectureLimit(wordSize), 16).resultStr.toUpperCase()})</strong>
        </div>
      )}
    </div>
  );
}

export default InputModule;
