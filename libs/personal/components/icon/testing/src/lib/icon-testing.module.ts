import { NgModule } from '@angular/core';

import { IconService } from '@po/personal/services/icon';
import { IconTestingService } from '@po/personal/services/icon/testing';

import { iconTestId } from './constants/icon-testing.const';

@NgModule({
  providers: [
    {
      provide: IconService,
      useFactory: () => new IconTestingService(iconTestId),
    },
  ],
})
export class IconTestingModule {}
