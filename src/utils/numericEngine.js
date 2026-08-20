/* global BigInt */
// Low-Level Numeric Base Conversion and ALU Simulation Engine
// Built manually without parseInt or toString conversion functions.

const HEX_CHAR_MAP = {
  '0': 0n, '1': 1n, '2': 2n, '3': 3n, '4': 4n, '5': 5n, '6': 6n, '7': 7n, '8': 8n, '9': 9n,
  'A': 10n, 'B': 11n, 'C': 12n, 'D': 13n, 'E': 14n, 'F': 15n
};

const HEX_VAL_MAP = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

// Validate that input characters match the selected base
export function validateInputCharacters(numStr, base) {
  const cleanStr = numStr.trim().toUpperCase();
  if (cleanStr.length === 0) return false;

  let validChars = '';
  if (base === 2) validChars = '01';
  else if (base === 8) validChars = '01234567';
  else if (base === 10) validChars = '0123456789';
  else if (base === 16) validChars = '0123456789ABCDEF';

  for (let i = 0; i < cleanStr.length; i++) {
    if (!validChars.includes(cleanStr[i])) {
      return false;
    }
  }
  return true;
}

// Convert any base (2, 8, 10, 16) to decimal BigInt using manual Positional Multiplication
export function anyBaseToDecimal(numStr, fromBase) {
  const cleanStr = numStr.trim().toUpperCase();
  const baseBig = BigInt(fromBase);
  let decimalVal = 0n;
  const steps = [];

  for (let i = 0; i < cleanStr.length; i++) {
    const char = cleanStr[i];
    const val = HEX_CHAR_MAP[char];
    const power = BigInt(cleanStr.length - 1 - i);
    const weight = baseBig ** power;
    const term = val * weight;
    
    decimalVal += term;

    steps.push({
      char,
      val: val.toString(),
      base: fromBase.toString(),
      power: power.toString(),
      weight: weight.toString(),
      term: term.toString(),
      accumulated: decimalVal.toString()
    });
  }

  return { decimalVal, steps };
}

// Convert decimal BigInt to any base (2, 8, 16) using manual Successive Divisions
export function decimalToAnyBase(decimalVal, toBase) {
  if (decimalVal === 0n) {
    return {
      resultStr: '0',
      steps: [{ dividend: '0', divisor: toBase.toString(), quotient: '0', residue: '0', hexResidue: '0' }]
    };
  }

  const baseBig = BigInt(toBase);
  let temp = decimalVal;
  const residues = [];
  const steps = [];

  while (temp > 0n) {
    const dividend = temp;
    const residue = temp % baseBig;
    const quotient = temp / baseBig;
    const hexResidue = HEX_VAL_MAP[Number(residue)];
    
    residues.push(hexResidue);
    
    steps.push({
      dividend: dividend.toString(),
      divisor: toBase.toString(),
      quotient: quotient.toString(),
      residue: residue.toString(),
      hexResidue
    });

    temp = quotient;
  }

  const resultStr = residues.reverse().join('');
  return { resultStr, steps };
}

// Get maximum value for a given word size (bits)
export function getArchitectureLimit(bits) {
  return (2n ** BigInt(bits)) - 1n;
}

// Format number representation with padding based on architecture width
export function applyPadding(numStr, base, bits) {
  const cleanStr = numStr.trim().toUpperCase();
  let targetLen = 0;

  if (base === 2) {
    targetLen = bits;
  } else if (base === 16) {
    targetLen = bits / 4;
  } else if (base === 8) {
    // Standard register padding for Octal:
    // 8 bits (max 377) -> 3 chars
    // 16 bits (max 177777) -> 6 chars
    // 32 bits (max 37777777777) -> 11 chars
    // 64 bits (max 1777777777777777777777) -> 22 chars
    if (bits === 8) targetLen = 3;
    else if (bits === 16) targetLen = 6;
    else if (bits === 32) targetLen = 11;
    else if (bits === 64) targetLen = 22;
  } else {
    // Decimal doesn't typically pad with zeros in computer registers, return as is
    return cleanStr;
  }

  if (cleanStr.length >= targetLen) return cleanStr;
  const paddingLen = targetLen - cleanStr.length;
  return '0'.repeat(paddingLen) + cleanStr;
}

// Simulates bitwise logic gates AND, OR, XOR bit-by-bit
export function simulateALU(binA, binB, operation, bits) {
  // Pad both binary strings to the architecture bit size
  const padA = applyPadding(binA, 2, bits);
  const padB = applyPadding(binB, 2, bits);
  
  let resultBinList = [];
  const steps = [];

  for (let i = 0; i < bits; i++) {
    const bitA = parseInt(padA[i]);
    const bitB = parseInt(padB[i]);
    let outBit = 0;

    if (operation === 'AND') {
      outBit = bitA & bitB;
    } else if (operation === 'OR') {
      outBit = bitA | bitB;
    } else if (operation === 'XOR') {
      outBit = bitA ^ bitB;
    }

    resultBinList.push(outBit);

    steps.push({
      index: bits - 1 - i, // Logical binary weight index
      bitA,
      bitB,
      operation,
      outBit
    });
  }

  const resultBin = resultBinList.join('');
  
  // Convert result binary back to decimal to return other base formats
  const { decimalVal } = anyBaseToDecimal(resultBin, 2);
  const hexResult = applyPadding(decimalToAnyBase(decimalVal, 16).resultStr, 16, bits);
  const decResult = decimalVal.toString();

  return {
    padA,
    padB,
    resultBin,
    hexResult,
    decResult,
    steps
  };
}

// Remove leading zeros from a string for compact display (cosmetic only)
// Returns '0' if the string is all zeros or empty after trimming.
export function trimLeadingZeros(str) {
  const trimmed = str.replace(/^0+/, '');
  return trimmed.length === 0 ? '0' : trimmed;
}
