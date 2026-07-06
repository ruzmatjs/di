import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProgressService } from './core/services/progress.service';
import { APP_CONFIG } from './core/tokens';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <header class="topbar">
      <a routerLink="/" class="brand">
        <span class="brand-mark">DI</span>
        <span class="brand-name">{{ config.appName }}</span>
      </a>
      <div class="progress-pill" [attr.aria-label]="'Umumiy progress ' + progress.percent() + ' foiz'">
        <div class="bar"><div class="fill" [style.width.%]="progress.percent()"></div></div>
        <span class="pct">{{ progress.completedCount() }}/{{ progress.totalCount }}</span>
      </div>
    </header>
    <main class="page">
      <router-outlet />
    </main>
    <footer class="foot">
      Angular Dependency Injection — Middle+ intervyuga tayyorgarlik
    </footer>
  `,
  styles: `
    .topbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 16px 28px; border-bottom: 1px solid var(--line);
      background: var(--card); position: sticky; top: 0; z-index: 10;
    }
    .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; color: var(--ink); }
    .brand-mark {
      font-family: var(--font-mono); font-weight: 500; font-size: 14px;
      background: var(--ink); color: var(--paper);
      padding: 5px 9px; border-radius: 8px;
    }
    .brand-name { font-family: var(--font-display); font-weight: 700; font-size: 18px; }
    .progress-pill { display: flex; align-items: center; gap: 10px; }
    .bar { width: 140px; height: 6px; background: var(--line); border-radius: 3px; overflow: hidden; }
    .fill { height: 100%; background: var(--accent); border-radius: 3px; transition: width 0.4s ease; }
    .pct { font-family: var(--font-mono); font-size: 13px; color: var(--ink-2); }
    .page { max-width: 880px; margin: 0 auto; padding: 36px 24px 80px; }
    .foot {
      text-align: center; color: var(--ink-3); font-size: 13px;
      padding: 24px; border-top: 1px solid var(--line);
    }
  `,
})
export class AppComponent {
  // DI DARSLIGI: ikkalasi ham root singleton —
  // Home, TopicDetail, Quiz sahifalari AYNI shu instance'larni ko'radi.
  protected progress = inject(ProgressService);
  protected config = inject(APP_CONFIG);
}
