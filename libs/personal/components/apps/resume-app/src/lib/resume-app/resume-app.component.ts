import { ChangeDetectionStrategy, Component } from '@angular/core';

import { EducationComponent } from './components/resume-education/resume-education.component';
import { ExperienceComponent } from './components/resume-experience/resume-experience.component';
import { ResumeHeaderComponent } from './components/resume-header/resume-header.component';
import { TechnicalSkillsComponent } from './components/resume-technical-skills/resume-technical-skills.component';

@Component({
  selector: 'ps-resume-app',
  templateUrl: './resume-app.component.html',
  imports: [
    ResumeHeaderComponent,
    EducationComponent,
    ExperienceComponent,
    TechnicalSkillsComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumeAppComponent {}
