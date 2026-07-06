import { Injectable, computed, signal } from '@angular/core';
import { QuizQuestion } from '../models';

/** DI DARSLIGI: bu service ATAYIN providedIn'siz —
 *  QuizComponent'da providers: [QuizEngine] orqali beriladi.
 *  Natija: har bir quiz sahifasi O'Z holatiga ega (sandboxing),
 *  sahifadan chiqilganda holat component bilan birga yo'qoladi. */
@Injectable()
export class QuizEngine {
  private questions = signal<QuizQuestion[]>([]);
  readonly currentIndex = signal(0);
  readonly answers = signal<Map<number, number>>(new Map());
  readonly finished = signal(false);

  readonly current = computed(() => this.questions()[this.currentIndex()]);
  readonly total = computed(() => this.questions().length);
  readonly selectedFor = computed(() => {
    const q = this.current();
    return q ? this.answers().get(q.id) : undefined;
  });

  readonly score = computed(() => {
    const qs = this.questions();
    let correct = 0;
    for (const q of qs) {
      if (this.answers().get(q.id) === q.correctIndex) correct++;
    }
    return qs.length ? Math.round((correct / qs.length) * 100) : 0;
  });

  start(questions: QuizQuestion[]): void {
    this.questions.set(questions);
    this.currentIndex.set(0);
    this.answers.set(new Map());
    this.finished.set(false);
  }

  select(optionIndex: number): void {
    const q = this.current();
    if (!q) return;
    // Immutable yangilash — yangi Map
    this.answers.update(m => new Map(m).set(q.id, optionIndex));
  }

  isAnswered(): boolean {
    return this.selectedFor() !== undefined;
  }

  next(): void {
    if (this.currentIndex() < this.total() - 1) {
      this.currentIndex.update(i => i + 1);
    } else {
      this.finished.set(true);
    }
  }
}
