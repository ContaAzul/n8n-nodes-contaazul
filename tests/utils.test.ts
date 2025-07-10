import { toYYYYMMDD } from '../nodes/ContaAzul/utils';

describe('Utils', () => {
  describe('toYYYYMMDD', () => {
    it('should convert ISO date string to YYYY-MM-DD format', () => {
      const input = '2024-01-15T10:30:00Z';
      const expected = '2024-01-15';
      expect(toYYYYMMDD(input)).toBe(expected);
    });

    it('should handle date string without time', () => {
      const input = '2024-01-15';
      const expected = '2024-01-15';
      expect(toYYYYMMDD(input)).toBe(expected);
    });

    it('should return empty string for empty input', () => {
      expect(toYYYYMMDD('')).toBe('');
    });

    it('should return empty string for null input', () => {
      expect(toYYYYMMDD(null as any)).toBe('');
    });

    it('should return empty string for undefined input', () => {
      expect(toYYYYMMDD(undefined as any)).toBe('');
    });

    it('should handle date with milliseconds', () => {
      const input = '2024-01-15T10:30:00.123Z';
      const expected = '2024-01-15';
      expect(toYYYYMMDD(input)).toBe(expected);
    });
  });
}); 