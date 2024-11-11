import { InjectionToken, NgModule } from '@angular/core';

export const IS_TEST = new InjectionToken('Is Test');

@NgModule({
  providers: [
    {
      provide: IS_TEST,
      useValue: true,
    },
  ],
})
export class TestingModule {}
