import { comparePassword, hashPassword } from './password.util';

jest.mock('@po/backend/utilities', () => ({
  ...jest.requireActual('@po/backend/utilities'),
  getEnvVar: jest.fn((varName: string) => {
    if (varName === 'PW_SALT_ROUNDS') return '10';
    return '';
  }),
}));

describe('Password Utilities', () => {
  describe('hashPassword', () => {
    test('should hash password and return a bcrypt hash string', async () => {
      const password = 'testPassword123';

      const result = await hashPassword(password);

      expect(typeof result).toBe('string');
      expect(result).toMatch(/^\$2[aby]\$\d{2}\$/);
      expect(result.length).toBeGreaterThan(50);
    });

    test('should generate different hashes for the same password', async () => {
      const password = 'samePassword';

      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('comparePassword', () => {
    test('should return true when password matches hash', async () => {
      const password = 'correctPassword123';
      const hashedPassword = await hashPassword(password);

      const result = await comparePassword(password, hashedPassword);

      expect(result).toBe(true);
    });

    test('should return false when password does not match hash', async () => {
      const password = 'correctPassword123';
      const wrongPassword = 'wrongPassword456';
      const hashedPassword = await hashPassword(password);

      const result = await comparePassword(wrongPassword, hashedPassword);

      expect(result).toBe(false);
    });

    test('should handle comparison with different passwords correctly', async () => {
      const correctPassword = 'password123';
      const wrongPassword = 'password456';
      const hashedPassword = await hashPassword(correctPassword);

      const correctResult = await comparePassword(
        correctPassword,
        hashedPassword,
      );
      const wrongResult = await comparePassword(wrongPassword, hashedPassword);

      expect(correctResult).toBe(true);
      expect(wrongResult).toBe(false);
    });
  });
});
