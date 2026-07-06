import { Component, OnInit, computed, inject, input, numberAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Level, LEVELS } from '../../core/models';
import { TopicsService } from '../../core/services/topics.service';
import { ProgressService } from '../../core/services/progress.service';
import { QuizEngine } from '../../core/services/quiz-engine.service';
import { APP_CONFIG } from '../../core/tokens';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [RouterLink],
  /** DI DARSLIGI: component-level provider!
   *  Har safar quiz sahifasi ochilganda YANGI QuizEngine yaratiladi,
   *  sahifadan chiqilganda component bilan birga yo'q qilinadi.
   *  Root singleton bo'lganda eski javoblar keyingi urinishga "oqib" qolardi. */
  providers: [QuizEngine],
  template: `
    <nav class="crumbs">
      <a routerLink="/">← Barcha mavzular</a>
      <span class="crumb-level">{{ levelName() }} · quiz</span>
    </nav>

    @if (!engine.finished()) {
      @if (engine.current(); as q) {
        <div class="meta">
          <span class="counter">{{ engine.currentIndex() + 1 }} / {{ engine.total() }}</span>
          <div class="mini-bar">
            <div class="mini-fill"
                 [style.width.%]="((engine.currentIndex() + 1) / engine.total()) * 100"></div>
          </div>
        </div>

        <h1 class="question">{{ q.question }}</h1>

        @if (q.code) {
          <pre><code>{{ q.code }}</code></pre>
        }

        <div class="options" role="radiogroup" aria-label="Javob variantlari">
          @for (opt of q.options; track $index) {
            <button class="option"
                    role="radio"
                    [attr.aria-checked]="engine.selectedFor() === $index"
                    [class.selected]="engine.selectedFor() === $index"
                    [class.correct]="showFeedback() && $index === q.correctIndex"
                    [class.wrong]="showFeedback() && engine.selectedFor() === $index && $index !== q.correctIndex"
                    [disabled]="showFeedback()"
                    (click)="engine.select($index)">
              <span class="opt-letter">{{ letters[$index] }}</span>
              {{ opt }}
            </button>
          }
        </div>

        @if (!showFeedback()) {
          <button class="btn-primary" [disabled]="!engine.isAnswered()"
                  (click)="check()">Tekshirish</button>
        } @else {
          <aside class="feedback"
                 [class.fb-ok]="engine.selectedFor() === q.correctIndex"
                 [class.fb-bad]="engine.selectedFor() !== q.correctIndex">
            <p class="fb-title">
              {{ engine.selectedFor() === q.correctIndex ? "To'g'ri!" : "Noto'g'ri" }}
            </p>
            <p class="fb-text">{{ q.explanation }}</p>
          </aside>
          <button class="btn-primary" (click)="goNext()">
            {{ engine.currentIndex() === engine.total() - 1 ? 'Natijani ko\\'rish' : 'Keyingi savol →' }}
          </button>
        }
      }
    } @else {
      <div class="result">
        <p class="result-score" [class.pass]="passed()">{{ engine.score() }}%</p>
        <h1>{{ passed() ? 'Tabriklaymiz — daraja topshirildi!' : 'Yana bir urinish kerak' }}</h1>
        <p class="result-note">
          O'tish chegarasi: {{ config.passScore }}%.
          @if (!passed()) {
            Mavzularni qayta ko'rib chiqib, qaytadan urinib ko'ring.
          }
        </p>
        <div class="result-actions">
          <button class="btn-primary" (click)="restart()">Qayta topshirish</button>
          <a class="nav-btn" routerLink="/">Mavzularga qaytish</a>
        </div>
      </div>
    }
  `,
  styles: `
    .crumbs { display: flex; justify-content: space-between; margin-bottom: 26px; }
    .crumbs a { text-decoration: none; font-size: 14px; }
    .crumb-level { font-family: var(--font-mono); font-size: 13px; color: var(--ink-3); }

    .meta { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
    .counter { font-family: var(--font-mono); font-size: 13px; color: var(--ink-2); }
    .mini-bar { flex: 1; height: 5px; background: var(--line); border-radius: 3px; overflow: hidden; }
    .mini-fill { height: 100%; background: var(--accent); transition: width 0.3s; }

    .question { font-size: 22px; margin: 0 0 20px; }
    pre { margin: 0 0 20px; }

    .options { display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px; }
    .option {
      display: flex; align-items: center; gap: 14px; text-align: left;
      background: var(--card); border: 1.5px solid var(--line);
      border-radius: var(--radius); padding: 14px 16px;
      font-size: 15px; font-family: var(--font-body); color: var(--ink);
      transition: border-color 0.15s;
    }
    .option:hover:not(:disabled) { border-color: var(--ink-3); }
    .option.selected { border-color: var(--accent); background: var(--accent-soft); }
    .option.correct { border-color: var(--ok); background: var(--ok-soft); }
    .option.wrong { border-color: var(--accent); background: var(--accent-soft); }
    .option:disabled { cursor: default; }
    .opt-letter {
      font-family: var(--font-mono); font-size: 13px; flex-shrink: 0;
      width: 26px; height: 26px; border-radius: 50%;
      border: 1px solid var(--line);
      display: flex; align-items: center; justify-content: center;
    }

    .btn-primary {
      background: var(--accent); color: #fff; border: none;
      padding: 12px 24px; border-radius: var(--radius);
      font-size: 15px; font-weight: 500;
    }
    .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

    .feedback {
      border-radius: var(--radius); padding: 16px 20px; margin-bottom: 20px;
    }
    .fb-ok { background: var(--ok-soft); border-left: 4px solid var(--ok); }
    .fb-bad { background: var(--accent-soft); border-left: 4px solid var(--accent); }
    .fb-title { font-weight: 600; margin: 0 0 6px; }
    .fb-text { margin: 0; font-size: 14.5px; }

    .result { text-align: center; padding: 40px 0; }
    .result-score {
      font-family: var(--font-mono); font-size: 64px; font-weight: 500;
      margin: 0; color: var(--accent);
    }
    .result-score.pass { color: var(--ok); }
    .result h1 { font-size: 26px; margin: 8px 0 10px; }
    .result-note { color: var(--ink-2); margin: 0 0 26px; }
    .result-actions { display: flex; gap: 12px; justify-content: center; }
    .nav-btn {
      border: 1px solid var(--line); background: var(--card);
      padding: 11px 20px; border-radius: var(--radius);
      text-decoration: none; color: var(--ink); font-size: 15px;
      display: inline-flex; align-items: center;
    }
  `,
})
export class QuizComponent implements OnInit {
  level = input.required({ transform: numberAttribute });

  protected letters = ['A', 'B', 'C', 'D'];

  private topics = inject(TopicsService);
  private progress = inject(ProgressService);
  protected engine = inject(QuizEngine);      // shu component'ning shaxsiy nusxasi
  protected config = inject(APP_CONFIG);      // InjectionToken'dan passScore

  private feedbackShown = new Set<number>();

  protected levelName = computed(
    () => LEVELS.find(l => l.level === this.level())?.name ?? ''
  );
  protected passed = computed(() => this.engine.score() >= this.config.passScore);

  ngOnInit(): void {
    this.engine.start(this.topics.getQuizByLevel(this.level() as Level));
  }

  protected showFeedback(): boolean {
    const q = this.engine.current();
    return q ? this.feedbackShown.has(q.id) : false;
  }

  protected check(): void {
    const q = this.engine.current();
    if (q && this.engine.isAnswered()) this.feedbackShown.add(q.id);
  }

  protected goNext(): void {
    this.engine.next();
    if (this.engine.finished() && this.passed()) {
      this.progress.markQuizPassed(this.level() as Level);
    }
  }

  protected restart(): void {
    this.feedbackShown.clear();
    this.engine.start(this.topics.getQuizByLevel(this.level() as Level));
  }
}
