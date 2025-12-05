import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { PxRemConverterComponent } from './components/px-rem-converter/px-rem-converter.component';
import {
  SidebarComponent,
  SidebarItem,
} from './components/sidebar/sidebar.component';
import { UuidGeneratorComponent } from './components/uuid-generator/uuid-generator.component';

@Component({
  selector: 'ps-dev-tools',
  imports: [SidebarComponent, PxRemConverterComponent, UuidGeneratorComponent],
  templateUrl: './dev-tools-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevToolsComponent {
  readonly sidebarItems: SidebarItem[] = [
    { id: 'px-rem', label: 'PX ↔ REM', icon: '📏' },
    { id: 'uuid', label: 'UUID Generator', icon: '🔑' },
  ];

  readonly activeToolId = signal('px-rem');

  onToolSelected(id: string): void {
    this.activeToolId.set(id);
  }
}
