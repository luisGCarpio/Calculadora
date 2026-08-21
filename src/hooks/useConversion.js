import { useMemo } from 'react';
import {
  validateInputCharacters,
  anyBaseToDecimal,
  decimalToAnyBase,
  getArchitectureLimit,
  applyPadding
} from '../utils/numericEngine';

export function useConversion(inputNum, inputBase, wordSize) {
  return useMemo(() => {
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

    const isValidChars = validateInputCharacters(inputNum, inputBase);
    if (!isValidChars) {
      return { ...errorData, error: `Caracteres inválidos para la base ${inputBase} seleccionada.` };
    }

    let decimalVal;
    let toDecimalSteps = [];
    try {
      const conv = anyBaseToDecimal(inputNum, inputBase);
      decimalVal = conv.decimalVal;
      toDecimalSteps = conv.steps;
    } catch (e) {
      return { ...errorData, error: 'Error al procesar la conversión posicional.' };
    }

    const limit = getArchitectureLimit(wordSize);
    if (decimalVal > limit) {
      return {
        ...errorData,
        error: `Overflow / Desbordamiento de Registro. El valor máximo permitido en ${wordSize} bits es ${limit.toString()} (2^${wordSize} - 1).`
      };
    }

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
}
