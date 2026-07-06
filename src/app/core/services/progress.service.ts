import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { APP_CONFIG } from '../tokens';
import { TOPICS } from '../topics.data';
import { Level } from '../models';

/** DI DARSLIGI: root singleton + InjectionToken inject qilish.
 *  Progress hamma sahifada umumiy bo'lishi kerak → providedIn: 'root'.
 *  storageKey konfiguratsiyadan keladi → inject(APP_CONFIG). */
@Injectable({ providedIn: 'root' })
export class ProgressService {
  private config = inject(APP_CONFIG); // InjectionToken + useValue namunasi

  private readonly completedIds = signal<Set<number>>(this.load());
  readonly quizPassed = signal<Set<Level>>(this.loadQuiz());

  readonly completedCount = computed(() => this.completedIds().size);
  readonly totalCount = TOPICS.length;
  readonly percent = computed(() =>
    Math.round((this.completedCount() / this.totalCount) * 100)
  );

  constructor() {
    // Signal o'zgarganda localStorage'ga yozish
    effect(() => {
      const data = {
        topics: [...this.completedIds()],
        quiz: [...this.quizPassed()],
      };
      try {
        localStorage.setItem(this.config.storageKey, JSON.stringify(data));
      } catch { /* SSR yoki private mode */ }
    });
  }

  isCompleted(id: number): boolean {
    return this.completedIds().has(id);
  }

  toggle(id: number): void {
    // DI DARSLIGI emas, lekin signal darsligi: MUTATSIYA EMAS —
    // yangi Set yaratamiz, aks holda signal o'zgarishni bildirmaydi.
    this.completedIds.update(set => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  markQuizPassed(level: Level): void {
    this.quizPassed.update(set => new Set(set).add(level));
  }

  levelProgress(level: Level): { done: number; total: number } {
    const topics = TOPICS.filter(t => t.level === level);
    const done = topics.filter(t => this.completedIds().has(t.id)).length;
    return { done, total: topics.length };
  }

  private load(): Set<number> {
    try {
      const raw = localStorage.getItem(this.config.storageKey);
      if (raw) return new Set(JSON.parse(raw).topics ?? []);
    } catch { /* ignore */ }
    return new Set();
  }

  private loadQuiz(): Set<Level> {
    try {
      const raw = localStorage.getItem(this.config.storageKey);
      if (raw) return new Set(JSON.parse(raw).quiz ?? []);
    } catch { /* ignore */ }
    return new Set();
  }
}
