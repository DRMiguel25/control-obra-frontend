import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card w-full shadow-lg border border-gray-200">
      <div class="card-body p-4">
        <h2 class="text-sm font-semibold text-gray-500">{{ title }}</h2>
        <div class="flex items-center justify-between">
          <p class="text-3xl font-extrabold" [ngClass]="{'text-red-600': isCritical, 'text-green-600': isPositive, 'text-slate-800': !isCritical && !isPositive}">
            {{ value | currency:'USD':'symbol':'1.0-2' }}
          </p>
          <span *ngIf="hasIcon" class="text-xl" [ngClass]="{'text-red-600': isCritical, 'text-green-600': isPositive}">
            <i class="fas" [ngClass]="{'fa-arrow-up': isCritical, 'fa-arrow-down': !isCritical}"></i>
          </span>
        </div>
        <p class="text-xs text-gray-400 mt-1">{{ subtitle }}</p>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCardComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: number | string;
  @Input() subtitle: string = '';
  @Input() isCritical: boolean = false;
  @Input() isPositive: boolean = false;
  @Input() hasIcon: boolean = false;
}