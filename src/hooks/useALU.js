import { useMemo } from 'react';
import {
  validateInputCharacters,
  anyBaseToDecimal,
  getArchitectureLimit,
  simulateALU
} from '../utils/numericEngine';

export function useALU(aluA, aluB, aluOp, wordSize) {
  return useMemo(() => {
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
}
