import React, { useState, useMemo } from 'react';
import './App.css';
import {
  validateInputCharacters,
  anyBaseToDecimal,
  decimalToAnyBase,
  getArchitectureLimit,
  applyPadding,
  simulateALU
} from './utils/numericEngine';

function App() {
  // 1. Converter States
  const [inputNum, setInputNum] = useState('5');
  const [inputBase, setInputBase] = useState(10);
  const [wordSize, setWordSize] = useState(8);

  // 2. ALU States
  const [aluA, setAluA] = useState('1010');
  const [aluB, setAluB] = useState('1100');
  const [aluOp, setAluOp] = useState('AND');

  // --- Core Base Conversion Logic ---
  const conversionData = useMemo(() => {
    const errorData = {
      decimalValue: null,
      outputs: { binary: '', octal: '', decimal: '', hexadecimal: '' },
      error: '',
      toDecimalSteps: [],
      toBasesSteps: {}
    };

    if (!inputNum.trim()) {
      return { ...errorData, error: 'Ingrese un número para comenzar.' };
    }

    // A. Validate characters for selected base
    const isValidChars = validateInputCharacters(inputNum, inputBase);
    if (!isValidChars) {
      return { ...errorData, error: `Caracteres inválidos para la base ${inputBase} seleccionada.` };
    }

    // B. Transform any base to central decimal (BigInt)
    let decimalVal;
    let toDecimalSteps = [];
    try {
      const conv = anyBaseToDecimal(inputNum, inputBase);
      decimalVal = conv.decimalVal;
      toDecimalSteps = conv.steps;
    } catch (e) {
      return { ...errorData, error: 'Error al procesar la conversión posicional.' };
    }

    // C. Check architectural overflow
    const limit = getArchitectureLimit(wordSize);
    if (decimalVal > limit) {
      return {
        ...errorData,
        error: `Overflow / Desbordamiento de Registro. El valor máximo permitido en ${wordSize} bits es ${limit.toString()} (2^${wordSize} - 1).`
      };
    }

    // D. Convert to all 4 bases with successive division and padding
    const binaryConv = decimalToAnyBase(decimalVal, 2);
    const octalConv = decimalToAnyBase(decimalVal, 8);
    const hexConv = decimalToAnyBase(decimalVal, 16);

    const outputs = {
      binary: applyPadding(binaryConv.resultStr, 2, wordSize),
      octal: applyPadding(octalConv.resultStr, 8, wordSize),
      decimal: decimalVal.toString(),
      hexadecimal: applyPadding(hexConv.resultStr, 16, wordSize)
    };

    return {
      decimalValue: decimalVal,
      outputs,
      error: '',
      toDecimalSteps,
      toBasesSteps: {
        2: binaryConv.steps,
        8: octalConv.steps,
        16: hexConv.steps
      }
    };
  }, [inputNum, inputBase, wordSize]);

  // --- ALU Simulation Logic ---
  const aluData = useMemo(() => {
    const errorData = {
      padA: '',
      padB: '',
      resultBin: '',
      hexResult: '',
      decResult: '',
      steps: [],
      error: ''
    };

    if (!aluA.trim() || !aluB.trim()) {
      return { ...errorData, error: 'Ingrese ambos operandos binarios.' };
    }

    const isValidA = validateInputCharacters(aluA, 2);
    const isValidB = validateInputCharacters(aluB, 2);
    if (!isValidA || !isValidB) {
      return { ...errorData, error: 'Los operandos de la ALU deben ser cadenas binarias puras (0 y 1).' };
    }

    // Check sizes
    const decA = anyBaseToDecimal(aluA, 2).decimalVal;
    const decB = anyBaseToDecimal(aluB, 2).decimalVal;
    const limit = getArchitectureLimit(wordSize);

    if (decA > limit || decB > limit) {
      return { ...errorData, error: `Desbordamiento en ALU. Los operandos deben caber en la arquitectura de ${wordSize} bits (máx: ${limit.toString()}).` };
    }

    try {
      const res = simulateALU(aluA, aluB, aluOp, wordSize);
      return { ...res, error: '' };
    } catch (e) {
      return { ...errorData, error: 'Error durante la simulación de compuertas de la ALU.' };
    }
  }, [aluA, aluB, aluOp, wordSize]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="app-container">
      {/* HEADER */}
      <header style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '22px', margin: 0 }}>Motor de Conversión y Aritmética ALU</h1>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Electrónica Digital • Ingeniería de Sistemas • CUL
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', fontSize: '11px', fontWeight: '700' }}>
          <span style={{ backgroundColor: 'var(--accent-cyan)', padding: '3px 8px', border: '1px solid var(--border-color)' }}>
            Modo: Manual (Sin parseInt/toString)
          </span>
          <span style={{ backgroundColor: 'var(--accent-magenta)', color: '#fff', padding: '3px 8px', border: '1px solid var(--border-color)' }}>
            Precisión: BigInt 64-bit
          </span>
        </div>
      </header>

      {/* DASHBOARD LAYOUT */}
      <div className="dashboard-layout">
        
        {/* COLUMN LEFT (70%): INPUTS, REGISTERS, AND ALU */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* MÓDULO 1: ENTRADA Y CONFIGURACIÓN */}
          <div className="lab-panel">
            <div className="panel-header">
              <h2 style={{ fontSize: '14px', margin: 0 }}>Módulo de Entrada de Datos</h2>
              <span className="register-label" style={{ backgroundColor: 'var(--accent-cyan)', color: '#000' }}>
                Fase 1 y 2
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Número a Procesar</label>
                <input
                  type="text"
                  value={inputNum}
                  onChange={(e) => setInputNum(e.target.value)}
                  className="form-control"
                  placeholder="Ingrese valor..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Base de Origen</label>
                <select
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
                <label className="form-label">Tamaño de Palabra (Arquitectura)</label>
                <select
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

          {/* MÓDULO 2: SALIDA MULTIBASE (PANEL DE REGISTROS) */}
          <div className="lab-panel">
            <div className="panel-header">
              <h2 style={{ fontSize: '14px', margin: 0 }}>Módulo de Salida Multibase (Registros)</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Binary display */}
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Registro Binario (Base 2)</label>
                <div className="register-display">
                  <span>{conversionData.error ? '---------' : conversionData.outputs.binary}</span>
                  <button 
                    onClick={() => copyToClipboard(conversionData.outputs.binary)}
                    disabled={!!conversionData.error}
                    className="action-button" 
                    style={{ padding: '2px 8px', fontSize: '10px' }}
                  >
                    Copiar
                  </button>
                </div>
              </div>

              {/* Octal display */}
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Registro Octal (Base 8)</label>
                <div className="register-display">
                  <span>{conversionData.error ? '---------' : conversionData.outputs.octal}</span>
                  <button 
                    onClick={() => copyToClipboard(conversionData.outputs.octal)}
                    disabled={!!conversionData.error}
                    className="action-button" 
                    style={{ padding: '2px 8px', fontSize: '10px' }}
                  >
                    Copiar
                  </button>
                </div>
              </div>

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
              <div>
                <label className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Registro Hexadecimal (Base 16)</label>
                <div className="register-display">
                  <span>{conversionData.error ? '---------' : `0x${conversionData.outputs.hexadecimal}`}</span>
                  <button 
                    onClick={() => copyToClipboard(conversionData.outputs.hexadecimal)}
                    disabled={!!conversionData.error}
                    className="action-button" 
                    style={{ padding: '2px 8px', fontSize: '10px' }}
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* MÓDULO 3: CAPA DE ARITMÉTICA LÓGICA (ALU) */}
          <div className="lab-panel">
            <div className="panel-header">
              <h2 style={{ fontSize: '14px', margin: 0 }}>Capa de Aritmética Lógica (ALU Simulator)</h2>
              <span className="register-label" style={{ backgroundColor: 'var(--accent-magenta)', color: '#fff' }}>
                Fase 3
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Operando A (Binario)</label>
                <input
                  type="text"
                  value={aluA}
                  onChange={(e) => setAluA(e.target.value)}
                  className="form-control"
                  placeholder="Ej. 1010..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Operando B (Binario)</label>
                <input
                  type="text"
                  value={aluB}
                  onChange={(e) => setAluB(e.target.value)}
                  className="form-control"
                  placeholder="Ej. 1100..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Operador Lógico</label>
                <select
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
                      {aluData.resultBin}
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
                      0x{aluData.hexResult}
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

        {/* COLUMN RIGHT (30%): MATH STEPS DEBUGGER */}
        <div className="lab-panel" style={{ position: 'sticky', top: '24px' }}>
          <div className="panel-header">
            <h2 style={{ fontSize: '14px', margin: 0 }}>Depurador de Proceso Matemático</h2>
            <span className="register-label" style={{ backgroundColor: 'var(--accent-green)', color: '#000' }}>
              Algoritmo
            </span>
          </div>

          {conversionData.error ? (
            <div style={{ color: 'var(--text-secondary)', fontSize: '12px', textAlign: 'center', padding: '24px' }}>
              [Esperando datos válidos para trazar algoritmos...]
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* 1. Any Base to Decimal (Teorema Fundamental) */}
              <div>
                <h3 style={{ fontSize: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '8px' }}>
                  1. Entrada a Base 10 (Suma Posicional)
                </h3>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Fórmula: Suma de (dígito × base ^ posición)
                </p>
                <div style={{ overflowX: 'auto' }}>
                  <table className="math-table">
                    <thead>
                      <tr>
                        <th>Dígito</th>
                        <th>Operación (d × b^p)</th>
                        <th>Término</th>
                        <th>Acumulado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversionData.toDecimalSteps.map((step, idx) => (
                        <tr key={`step-dec-${idx}`}>
                          <td style={{ fontWeight: '700' }}>{step.char}</td>
                          <td>{step.val} × {step.base}<sup>{step.power}</sup></td>
                          <td className="highlight-text-cyan">{step.term}</td>
                          <td style={{ fontWeight: '700' }}>{step.accumulated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ fontSize: '12px', fontWeight: '700', marginTop: '8px', textAlign: 'right' }}>
                  Decimal Central = <span className="highlight-text-cyan">{conversionData.outputs.decimal}</span>
                </div>
              </div>

              {/* 2. Successive Divisions */}
              <div>
                <h3 style={{ fontSize: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '8px' }}>
                  2. Base 10 a Salidas (Divisiones Sucesivas)
                </h3>
                
                {/* Select target base to view steps */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[2, 8, 16].map((targetBase) => {
                    const steps = conversionData.toBasesSteps[targetBase] || [];
                    const baseNames = { 2: 'Binaria', 8: 'Octal', 16: 'Hexadecimal' };
                    return (
                      <details key={`details-base-${targetBase}`} style={{ border: '1px solid var(--border-muted)', padding: '8px' }}>
                        <summary style={{ fontSize: '11px', fontWeight: '700', cursor: 'pointer', outline: 'none', userSelect: 'none' }}>
                          División Sucesiva Base {targetBase} ({baseNames[targetBase]})
                        </summary>
                        <div style={{ marginTop: '8px', overflowX: 'auto' }}>
                          <table className="math-table">
                            <thead>
                              <tr>
                                <th>Dividendo</th>
                                <th>÷ Base</th>
                                <th>Cociente</th>
                                <th>Residuo</th>
                                <th>Mapeo</th>
                              </tr>
                            </thead>
                            <tbody>
                              {steps.map((step, idx) => (
                                <tr key={`step-${targetBase}-${idx}`}>
                                  <td>{step.dividend}</td>
                                  <td>÷ {step.divisor}</td>
                                  <td>{step.quotient}</td>
                                  <td className="highlight-text-green">{step.residue}</td>
                                  <td style={{ fontWeight: '700', color: 'var(--accent-magenta)' }}>{step.hexResidue}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <div style={{ fontSize: '11px', marginTop: '8px', color: 'var(--text-secondary)' }}>
                            Invertido: <strong style={{ color: 'var(--text-primary)' }}>
                              {steps.map(s => s.hexResidue).reverse().join('')}
                            </strong>
                          </div>
                        </div>
                      </details>
                    );
                  })}
                </div>
              </div>

              {/* 3. ALU Truth Table Helper */}
              <div>
                <h3 style={{ fontSize: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '8px' }}>
                  3. Tabla de Verdad de la ALU ({aluOp})
                </h3>
                <table className="math-table" style={{ width: '80%', margin: '0 auto' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center' }}>Bit A</th>
                      <th style={{ textAlign: 'center' }}>Bit B</th>
                      <th style={{ textAlign: 'center' }}>{aluOp}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ fontWeight: aluOp === 'AND' ? 'normal' : 'normal' }}>
                      <td style={{ textAlign: 'center' }}>0</td>
                      <td style={{ textAlign: 'center' }}>0</td>
                      <td style={{ textAlign: 'center', backgroundColor: (aluOp === 'AND' || aluOp === 'OR' || aluOp === 'XOR') && 'var(--bg-secondary)' }}>0</td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'center' }}>0</td>
                      <td style={{ textAlign: 'center' }}>1</td>
                      <td style={{ textAlign: 'center', backgroundColor: aluOp === 'OR' || aluOp === 'XOR' ? 'var(--accent-green)' : 'var(--bg-secondary)' }}>
                        {aluOp === 'OR' || aluOp === 'XOR' ? '1' : '0'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'center' }}>1</td>
                      <td style={{ textAlign: 'center' }}>0</td>
                      <td style={{ textAlign: 'center', backgroundColor: aluOp === 'OR' || aluOp === 'XOR' ? 'var(--accent-green)' : 'var(--bg-secondary)' }}>
                        {aluOp === 'OR' || aluOp === 'XOR' ? '1' : '0'}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ textAlign: 'center' }}>1</td>
                      <td style={{ textAlign: 'center' }}>1</td>
                      <td style={{ textAlign: 'center', backgroundColor: aluOp === 'AND' || aluOp === 'OR' ? 'var(--accent-green)' : 'var(--bg-secondary)' }}>
                        {aluOp === 'AND' || aluOp === 'OR' ? '1' : '0'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <footer 
        style={{
          borderTop: '2px solid var(--border-color)',
          paddingTop: '24px',
          marginTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <span style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>uhhhpacho</span>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            © {new Date().getFullYear()} uhhhpacho. Proyectos de Electrónica Digital.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: '700' }}>
          <span style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2px', cursor: 'default' }}>
            Electrónica Digital CUL
          </span>
          <span style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '2px', cursor: 'default' }}>
            Ingeniería de Sistemas
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;