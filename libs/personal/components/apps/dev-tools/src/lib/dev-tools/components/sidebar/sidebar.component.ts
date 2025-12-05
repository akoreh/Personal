import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'ps-dev-tools-sidebar',
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  readonly items = input.required<SidebarItem[]>();
  readonly activeItemId = input.required<string>();

  readonly itemSelected = output<string>();

  selectItem(id: string): void {
    this.itemSelected.emit(id);
  }
}
