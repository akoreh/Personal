import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContactInfoComponent } from '../resume-contact-info/resume-contact-info.component';

@Component({
  selector: 'ps-resume-header',
  templateUrl: './resume-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ContactInfoComponent],
})
export class ResumeHeaderComponent {}
