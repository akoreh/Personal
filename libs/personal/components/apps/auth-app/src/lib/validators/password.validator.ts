import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { validatePassword } from '@po/shared/validators';

/**
 * Angular validator that uses the shared validatePassword function.
 * Returns { password: true } if invalid, null if valid.
 */
export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;

    return validatePassword(value) ? null : { password: true };
  };
}
