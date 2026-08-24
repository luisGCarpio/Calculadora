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
      {/* HEADER BANNER (Neo-Brutalist Pink Hero Card) */}
      <header className="app-header-card">
        <div>
          <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🚀</div>
          <h1 className="app-header-title">Motor de Conversión y Aritmética ALU</h1>
          <p className="app-header-subtitle">
            Electrónica Digital • Ingeniería de Sistemas • CUL
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span className="badge-pill-black">
            Modo: Manual
          </span>
          <span className="badge-pill-black" style={{ backgroundColor: '#ffffff', color: '#000000', border: '2px solid #000000' }}>
            BigInt 64-bit
          </span>
        </div>
      </header>

      {/* DASHBOARD LAYOUT */}
      <div className="dashboard-layout">
        
        {/* COLUMN LEFT (62%): INPUTS, REGISTERS, AND ALU */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
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

        {/* COLUMN RIGHT (38%): MATH STEPS DEBUGGER */}
        <MathDebugger
          conversionData={conversionData}
          aluOp={aluOp}
        />

      </div>

      {/* FOOTER BAR (Neo-Brutalist Pill Shape) */}
      <footer className="app-footer-card">
        <div>
          <span style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Uhhhh Pacho • Electrónica Digital</span>
          <p style={{ fontSize: '11px', color: '#2D3748', marginTop: '2px', fontWeight: '600' }}>
            © {new Date().getFullYear()} ApexCode. Todos los derechos reservados.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span className="badge-pill-black" style={{ backgroundColor: '#ffffff', color: '#000000', border: '2px solid #000' }}>
            6to Semestre
          </span>
          <span className="badge-pill-black">
            ApexCode
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;