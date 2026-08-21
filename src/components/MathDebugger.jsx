import React from 'react';

function MathDebugger({ conversionData, aluOp }) {
  return (
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
  );
}

export default MathDebugger;
