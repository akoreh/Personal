import { FormControl } from '@angular/forms';

import { passwordValidator } from './password.validator';

describe('passwordValidator', () => {
  const validator = passwordValidator();

  test('should return error for empty value', () => {
    const control = new FormControl('');
    expect(validator(control)).toEqual({ password: true });
  });

  test('should return error for null value', () => {
    const control = new FormControl(null);
    expect(validator(control)).toEqual({ password: true });
  });

  test('should return null for valid password', () => {
    const control = new FormControl('ValidPass1!');
    expect(validator(control)).toBeNull();
  });

  test('should return error for password too short', () => {
    const control = new FormControl('Ab1!');
    expect(validator(control)).toEqual({ password: true });
  });

  test('should return error for password missing uppercase', () => {
    const control = new FormControl('lowercase1!');
    expect(validator(control)).toEqual({ password: true });
  });

  test('should return error for password missing lowercase', () => {
    const control = new FormControl('UPPERCASE1!');
    expect(validator(control)).toEqual({ password: true });
  });

  test('should return error for password missing number', () => {
    const control = new FormControl('NoNumbers!');
    expect(validator(control)).toEqual({ password: true });
  });

  test('should return error for password missing special character', () => {
    const control = new FormControl('NoSpecial1');
    expect(validator(control)).toEqual({ password: true });
  });

  test('should return null for password with all requirements met', () => {
    const control = new FormControl('MyP@ssw0rd!');
    expect(validator(control)).toBeNull();
  });

  test('should return null for password with various special chars', () => {
    const validPasswords = [
      'Password1!',
      'Password1@',
      'Password1#',
      'Password1$',
      'Password1%',
      'Password1^',
      'Password1&',
      'Password1*',
      'Password1(',
      'Password1)',
      'Password1_',
      'Password1-',
      'Password1+',
    ];

    validPasswords.forEach((pwd) => {
      const control = new FormControl(pwd);
      expect(validator(control)).toBeNull();
    });
  });
});
