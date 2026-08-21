import {
  validateInputCharacters,
  anyBaseToDecimal,
  decimalToAnyBase,
  getArchitectureLimit,
  applyPadding,
  simulateALU,
  trimLeadingZeros
} from './numericEngine';

describe('validateInputCharacters', () => {
  test('acepta binario válido', () => {
    expect(validateInputCharacters('1010', 2)).toBe(true);
  });
  test('rechaza binario inválido', () => {
    expect(validateInputCharacters('1012', 2)).toBe(false);
  });
});

describe('anyBaseToDecimal', () => {
  test('convierte FF hex a 255 decimal', () => {
    expect(anyBaseToDecimal('FF', 16).decimalVal).toBe(255n);
  });
  test('convierte 1010 binario a 10 decimal', () => {
    expect(anyBaseToDecimal('1010', 2).decimalVal).toBe(10n);
  });
});

describe('decimalToAnyBase', () => {
  test('convierte 255 decimal a FF hex', () => {
    expect(decimalToAnyBase(255n, 16).resultStr).toBe('FF');
  });
  test('convierte 0 decimal correctamente', () => {
    expect(decimalToAnyBase(0n, 2).resultStr).toBe('0');
  });
});

describe('getArchitectureLimit', () => {
  test('límite de 8 bits es 255', () => {
    expect(getArchitectureLimit(8)).toBe(255n);
  });
});

describe('applyPadding', () => {
  test('rellena binario a 8 bits', () => {
    expect(applyPadding('101', 2, 8)).toBe('00000101');
  });
});

describe('simulateALU', () => {
  test('AND de 1010 y 1100 en 8 bits', () => {
    const res = simulateALU('1010', '1100', 'AND', 8);
    expect(res.resultBin).toBe('00001000');
  });
});

describe('trimLeadingZeros', () => {
  test('quita ceros a la izquierda', () => {
    expect(trimLeadingZeros('00000101')).toBe('101');
  });
  test('deja un cero si todo es cero', () => {
    expect(trimLeadingZeros('0000')).toBe('0');
  });
});
