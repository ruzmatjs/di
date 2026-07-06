import { Component, computed, inject, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TopicsService } from '../../core/services/topics.service';
import { ProgressService } from '../../core/services/progress.service';

@Component({
  selector: 'app-topic-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (topic(); as t) {
      <nav class="crumbs">
        <a routerLink="/">← Barcha mavzular</a>
        <span class="crumb-level">{{ t.level }}-daraja</span>
      </nav>

      <article>
        <header class="head">
          <h1>{{ t.id }}. {{ t.title }}</h1>
          <span class="tag" [class]="'tag-' + t.tag">{{ t.tag }}</span>
        </header>

        @for (para of t.content; track $index) {
          <p class="para">{{ para }}</p>
        }

        @if (t.code) {
          <pre><code>{{ t.code }}</code></pre>
        }

        @if (t.interviewQuestion) {
          <aside class="iq">
            <p class="iq-label">Intervyu savoli</p>
            <p class="iq-text">{{ t.interviewQuestion }}</p>
            <p class="iq-hint">Bu savolga ovoz chiqarib, 60–90 soniyada javob berib ko'ring — keyin matnga qaytib solishtiring.</p>
          </aside>
        }

        <div class="actions">
          <button class="btn-done" (click)="progress.toggle(t.id)"
                  [class.is-done]="progress.isCompleted(t.id)">
            {{ progress.isCompleted(t.id) ? "✓ O'rganildi" : "O'rganildi deb belgilash" }}
          </button>

          <div class="nav-links">
            @if (prev(); as p) {
              <a class="nav-btn" [routerLink]="['/topic', p.id]">← {{ p.id }}-mavzu</a>
            }
            @if (next(); as n) {
              <a class="nav-btn" [routerLink]="['/topic', n.id]">{{ n.id }}-mavzu →</a>
            } @else {
              <a class="nav-btn accent" [routerLink]="['/quiz', t.level]">Daraja quizi →</a>
            }
          </div>
        </div>
      </article>
    } @else {
      <p>Mavzu topilmadi. <a routerLink="/">Bosh sahifaga qaytish</a></p>
    }
  `,
  styles: `
    .crumbs {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 26px;
    }
    .crumbs a { text-decoration: none; font-size: 14px; }
    .crumbs a:hover { text-decoration: underline; }
    .crumb-level { font-family: var(--font-mono); font-size: 13px; color: var(--ink-3); }

    .head { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px; }
    h1 { font-size: 28px; margin: 0; flex: 1; }
    .tag {
      font-family: var(--font-mono); font-size: 11px;
      padding: 4px 10px; border-radius: 20px; margin-top: 8px;
    }
    .tag-intervyu { background: var(--accent-soft); color: var(--accent); }
    .tag-amaliy { background: var(--ok-soft); color: var(--ok); }
    .tag-murakkab { background: var(--warn-soft); color: var(--warn); }

    .para { margin: 0 0 16px; }
    pre { margin: 22px 0; }

    .iq {
      background: var(--card); border: 1px solid var(--line);
      border-left: 4px solid var(--accent); border-radius: var(--radius);
      padding: 16px 20px; margin: 26px 0;
    }
    .iq-label {
      font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.06em;
      text-transform: uppercase; color: var(--accent); margin: 0 0 6px;
    }
    .iq-text { font-weight: 500; margin: 0 0 8px; }
    .iq-hint { font-size: 13.5px; color: var(--ink-3); margin: 0; }

    .actions {
      display: flex; justify-content: space-between; align-items: center;
      gap: 16px; margin-top: 34px; flex-wrap: wrap;
    }
    .btn-done {
      background: var(--ink); color: var(--paper); border: none;
      padding: 11px 20px; border-radius: var(--radius);
      font-size: 14px; font-weight: 500;
    }
    .btn-done.is-done { background: var(--ok); }
    .nav-links { display: flex; gap: 10px; }
    .nav-btn {
      border: 1px solid var(--line); background: var(--card);
      padding: 10px 16px; border-radius: var(--radius);
      text-decoration: none; color: var(--ink); font-size: 14px;
    }
    .nav-btn:hover { border-color: var(--accent); }
    .nav-btn.accent { border-color: var(--accent); color: var(--accent); font-weight: 500; }
  `,
})
export class TopicDetailComponent {
  /** DI DARSLIGI (bonus): withComponentInputBinding tufayli
   *  route param :id to'g'ridan-to'g'ri input signal bo'lib keladi. */
  id = input.required({ transform: numberAttribute });

  private topics = inject(TopicsService);
  protected progress = inject(ProgressService);

  protected topic = computed(() => this.topics.getById(this.id()));
  protected next = computed(() => this.topics.getById(this.id() + 1));
  protected prev = computed(() => this.topics.getById(this.id() - 1));
}
