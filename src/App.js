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