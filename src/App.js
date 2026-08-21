import React, { useState } from 'react';
import './App.css';
import { useConversion } from './hooks/useConversion';
import { useALU } from './hooks/useALU';
import InputModule from './components/InputModule';
import RegistersPanel from './components/RegistersPanel';
import AluPanel from './components/AluPanel';
import MathDebugger from './components/MathDebugger';

function App() {
  // 1. Converter States
  const [inputNum, setInputNum] = useState('5');
  const [inputBase, setInputBase] = useState(10);
  const [wordSize, setWordSize] = useState(8);

  // 2. ALU States
  const [aluA, setAluA] = useState('1010');
  const [aluB, setAluB] = useState('1100');
  const [aluOp, setAluOp] = useState('AND');

  // 3. Display States
  const [compactView, setCompactView] = useState(false);

  // --- Core Base Conversion Logic ---
  const conversionData = useConversion(inputNum, inputBase, wordSize);

  // --- ALU Simulation Logic ---
  const aluData = useALU(aluA, aluB, aluOp, wordSize);

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
          <InputModule
            inputNum={inputNum}
            setInputNum={setInputNum}
            inputBase={inputBase}
            setInputBase={setInputBase}
            wordSize={wordSize}
            setWordSize={setWordSize}
            conversionData={conversionData}
          />

          {/* MÓDULO 2: SALIDA MULTIBASE (PANEL DE REGISTROS) */}
          <RegistersPanel
            conversionData={conversionData}
            compactView={compactView}
            setCompactView={setCompactView}
            copyToClipboard={copyToClipboard}
          />

          {/* MÓDULO 3: CAPA DE ARITMÉTICA LÓGICA (ALU) */}
          <AluPanel
            aluA={aluA}
            setAluA={setAluA}
            aluB={aluB}
            setAluB={setAluB}
            aluOp={aluOp}
            setAluOp={setAluOp}
            aluData={aluData}
            wordSize={wordSize}
            compactView={compactView}
          />

        </div>

        {/* COLUMN RIGHT (30%): MATH STEPS DEBUGGER */}
        <MathDebugger
          conversionData={conversionData}
          aluOp={aluOp}
        />

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