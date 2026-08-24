import React from 'react';

function MathDebugger({ conversionData, aluOp }) {
  return (
    <div className="lab-panel panel-debugger" style={{ position: 'sticky', top: '24px' }}>
      <div className="panel-header">
        <h2>Depurador de Proceso Matemático</h2>
      </div>

      {conversionData.error ? (
        <div style={{ color: '#2D3748', fontSize: '13px', textAlign: 'center', padding: '24px', fontWeight: '700' }}>
          [Esperando datos válidos para trazar algoritmos...]
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* 1. Any Base to Decimal (Teorema Fundamental) */}
          <div>
            <h3 style={{ fontSize: '13px', borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '8px', fontWeight: '800' }}>
              1. Entrada a Base 10 (Suma Posicional)
            </h3>
            <p style={{ fontSize: '11px', color: '#2D3748', marginBottom: '8px', fontWeight: '600' }}>
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
                      <td style={{ fontWeight: '800' }}>{step.char}</td>
                      <td>{step.val} × {step.base}<sup>{step.power}</sup></td>
                      <td><span className="highlight-text-cyan">{step.term}</span></td>
                      <td style={{ fontWeight: '800' }}>{step.accumulated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: '12px', fontWeight: '800', marginTop: '8px', textAlign: 'right' }}>
              Decimal Central = <span className="highlight-text-cyan">{conversionData.outputs.decimal}</span>
            </div>
          </div>

          {/* 2. Successive Divisions */}
          <div>
            <h3 style={{ fontSize: '13px', borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '8px', fontWeight: '800' }}>
              2. Base 10 a Salidas (Divisiones Sucesivas)
            </h3>

            {/* Select target base to view steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[2, 8, 16].map((targetBase) => {
                const steps = conversionData.toBasesSteps[targetBase] || [];
                const baseNames = { 2: 'Binaria', 8: 'Octal', 16: 'Hexadecimal' };
                return (
                  <details key={`details-base-${targetBase}`} style={{ border: '2px solid #000', borderRadius: '10px', padding: '8px', background: '#ffffff' }}>
                    <summary style={{ fontSize: '12px', fontWeight: '800', cursor: 'pointer', outline: 'none', userSelect: 'none' }}>
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
                              <td><span className="highlight-text-green">{step.residue}</span></td>
                              <td style={{ fontWeight: '800' }}><span className="highlight-text-magenta">{step.hexResidue}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div style={{ fontSize: '11px', marginTop: '8px', color: '#2D3748', fontWeight: '700' }}>
                        Invertido: <strong style={{ color: '#000', fontWeight: '900' }}>
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
            <h3 style={{ fontSize: '13px', borderBottom: '2px solid #000', paddingBottom: '6px', marginBottom: '8px', fontWeight: '800' }}>
              3. Tabla de Verdad de la ALU ({aluOp})
            </h3>
            <table className="math-table" style={{ width: '90%', margin: '0 auto' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }}>Bit A</th>
                  <th style={{ textAlign: 'center' }}>Bit B</th>
                  <th style={{ textAlign: 'center' }}>{aluOp}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ textAlign: 'center' }}>0</td>
                  <td style={{ textAlign: 'center' }}>0</td>
                  <td style={{ textAlign: 'center', fontWeight: '800' }}>0</td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>0</td>
                  <td style={{ textAlign: 'center' }}>1</td>
                  <td style={{ textAlign: 'center', fontWeight: '800' }}>
                    <span className={aluOp === 'OR' || aluOp === 'XOR' ? 'highlight-text-green' : ''}>
                      {aluOp === 'OR' || aluOp === 'XOR' ? '1' : '0'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>1</td>
                  <td style={{ textAlign: 'center' }}>0</td>
                  <td style={{ textAlign: 'center', fontWeight: '800' }}>
                    <span className={aluOp === 'OR' || aluOp === 'XOR' ? 'highlight-text-green' : ''}>
                      {aluOp === 'OR' || aluOp === 'XOR' ? '1' : '0'}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={{ textAlign: 'center' }}>1</td>
                  <td style={{ textAlign: 'center' }}>1</td>
                  <td style={{ textAlign: 'center', fontWeight: '800' }}>
                    <span className={aluOp === 'AND' || aluOp === 'OR' ? 'highlight-text-green' : ''}>
                      {aluOp === 'AND' || aluOp === 'OR' ? '1' : '0'}
                    </span>
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
