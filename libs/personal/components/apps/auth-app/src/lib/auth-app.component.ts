import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonComponent } from '@po/personal/components/button';
import {
  FormFieldComponent,
  FormFieldErrorComponent,
} from '@po/personal/components/form-field';
import { InputComponent } from '@po/personal/components/input';

@Component({
  selector: 'ps-auth-app',
  templateUrl: './auth-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    FormFieldComponent,
    FormFieldErrorComponent,
    InputComponent,
    ButtonComponent,
  ],
})
export class AuthAppComponent {
  protected readonly form = new FormGroup({
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl<string | null>(null, [Validators.required]),
  });

  protected readonly px = signal('16');

  protected readonly rem = computed(() =>
    (parseInt(this.px(), 10) / 16).toString(),
  );
}
