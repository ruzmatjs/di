import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEVELS } from '../../core/models';
import { TopicsService } from '../../core/services/topics.service';
import { ProgressService } from '../../core/services/progress.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <p class="eyebrow">Angular · Middle+ intervyu</p>
      <h1>Dependency Injection<br>to'liq yo'l xaritasi</h1>
      <p class="lede">
        25 mavzu, 5 daraja — <code class="inline">new</code> muammosidan
        <code class="inline">injectAsync</code>gacha. Har darajada nazariya, kod misollari
        va bilimni sinovchi quiz.
      </p>
    </section>

    @for (lvl of levels; track lvl.level) {
      <section class="level">
        <header class="level-head">
          <span class="level-num">{{ lvl.icon }}</span>
          <div class="level-title">
            <h2>{{ lvl.name }}</h2>
            <span class="difficulty">{{ lvl.difficulty }}</span>
          </div>
          <div class="level-stats">
            {{ progress.levelProgress(lvl.level).done }}/{{ progress.levelProgress(lvl.level).total }}
            @if (progress.quizPassed().has(lvl.level)) {
              <span class="quiz-badge" title="Quiz topshirilgan">quiz ✓</span>
            }
          </div>
        </header>

        <ul class="topics">
          @for (topic of topics.getByLevel(lvl.level); track topic.id) {
            <li>
              <a class="topic" [routerLink]="['/topic', topic.id]"
                 [class.done]="progress.isCompleted(topic.id)">
                <span class="check" aria-hidden="true">
                  {{ progress.isCompleted(topic.id) ? '✓' : '' }}
                </span>
                <span class="topic-body">
                  <span class="topic-title">{{ topic.id }}. {{ topic.title }}</span>
                  <span class="topic-short">{{ topic.short }}</span>
                </span>
                <span class="tag" [class]="'tag-' + topic.tag">{{ topic.tag }}</span>
              </a>
            </li>
          }
        </ul>

        <a class="quiz-link" [routerLink]="['/quiz', lvl.level]">
          {{ lvl.level }}-daraja quizini boshlash →
        </a>
      </section>
    }
  `,
  styles: `
    .hero { margin-bottom: 48px; }
    .eyebrow {
      font-family: var(--font-mono); font-size: 13px; color: var(--accent);
      letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 8px;
    }
    h1 { font-size: 40px; margin: 0 0 14px; font-weight: 700; }
    .lede { font-size: 18px; color: var(--ink-2); max-width: 560px; margin: 0; }

    .level { margin-bottom: 44px; }
    .level-head {
      display: flex; align-items: center; gap: 14px;
      padding-bottom: 12px; border-bottom: 2px solid var(--ink);
      margin-bottom: 14px;
    }
    .level-num {
      font-family: var(--font-mono); font-size: 26px; font-weight: 500;
      color: var(--accent);
    }
    .level-title { flex: 1; display: flex; align-items: baseline; gap: 12px; }
    .level-title h2 { font-size: 21px; margin: 0; }
    .difficulty {
      font-family: var(--font-mono); font-size: 12px; color: var(--ink-3);
    }
    .level-stats {
      font-family: var(--font-mono); font-size: 13px; color: var(--ink-2);
      display: flex; align-items: center; gap: 8px;
    }
    .quiz-badge {
      background: var(--ok-soft); color: var(--ok);
      padding: 2px 9px; border-radius: 20px; font-size: 12px;
    }

    .topics { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
    .topic {
      display: flex; align-items: center; gap: 14px;
      background: var(--card); border: 1px solid var(--line);
      border-radius: var(--radius); padding: 13px 16px;
      text-decoration: none; color: var(--ink);
      transition: border-color 0.15s, transform 0.15s;
    }
    .topic:hover { border-color: var(--accent); transform: translateX(3px); }
    .topic.done { opacity: 0.6; }
    .topic.done .topic-title { text-decoration: line-through; }
    .check {
      width: 22px; height: 22px; flex-shrink: 0;
      border: 1.5px solid var(--line); border-radius: 6px;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; color: var(--ok);
    }
    .topic.done .check { background: var(--ok-soft); border-color: var(--ok); }
    .topic-body { flex: 1; display: flex; flex-direction: column; }
    .topic-title { font-weight: 500; font-size: 15px; }
    .topic-short { font-size: 13px; color: var(--ink-3); }
    .tag {
      font-family: var(--font-mono); font-size: 11px;
      padding: 3px 9px; border-radius: 20px; flex-shrink: 0;
    }
    .tag-intervyu { background: var(--accent-soft); color: var(--accent); }
    .tag-amaliy { background: var(--ok-soft); color: var(--ok); }
    .tag-murakkab { background: var(--warn-soft); color: var(--warn); }

    .quiz-link {
      display: inline-block; margin-top: 14px;
      font-weight: 500; font-size: 14px; text-decoration: none;
      color: var(--accent);
    }
    .quiz-link:hover { text-decoration: underline; }

    @media (max-width: 560px) {
      h1 { font-size: 30px; }
      .tag { display: none; }
    }
  `,
})
export class HomeComponent {
  protected levels = LEVELS;
  protected topics = inject(TopicsService);
  protected progress = inject(ProgressService);
}
