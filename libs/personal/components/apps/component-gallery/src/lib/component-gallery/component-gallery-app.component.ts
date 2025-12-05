import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { ButtonGalleryComponent } from './components/button-gallery/button-gallery.component';
import { InputGalleryComponent } from './components/input-gallery/input-gallery.component';

type GallerySection = 'buttons' | 'inputs';

@Component({
  selector: 'ps-component-gallery-app',
  templateUrl: './component-gallery-app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonGalleryComponent, InputGalleryComponent],
})
export class ComponentGalleryAppComponent {
  readonly activeSection = signal<GallerySection>('buttons');

  selectSection(section: GallerySection): void {
    this.activeSection.set(section);
  }
}
