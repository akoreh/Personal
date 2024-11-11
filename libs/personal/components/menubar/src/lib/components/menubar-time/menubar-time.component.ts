import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { IS_TEST } from '@po/shared/testing';
import { interval } from 'rxjs';

@UntilDestroy()
@Component({
  standalone: true,
  selector: 'ps-menubar-time',
  templateUrl: 'menubar-time.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
})
export class MenuBarTimeComponent implements OnInit {
  protected now = new Date();
  protected showColons = true;

  private readonly isTest = inject(IS_TEST, { optional: true });
  private readonly changeDetector = inject(ChangeDetectorRef);

  ngOnInit() {
    // TODO: Find a better solution
    if (this.isTest) {
      return;
    }

    interval(1_000).subscribe({
      next: () => {
        this.now = new Date();
        this.showColons = !this.showColons;
        this.changeDetector.detectChanges();
      },
    });
  }
}
