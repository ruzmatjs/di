import { Injectable } from '@angular/core';
import { Topic, Level, QuizQuestion } from '../models';
import { TOPICS } from '../topics.data';
import { QUIZ_QUESTIONS } from '../quiz.data';

/** DI DARSLIGI: providedIn: 'root' — stateless data service.
 *  Butun ilova uchun bitta instance, tree-shakable. */
@Injectable({ providedIn: 'root' })
export class TopicsService {
  getAll(): Topic[] {
    return TOPICS;
  }

  getByLevel(level: Level): Topic[] {
    return TOPICS.filter(t => t.level === level);
  }

  getById(id: number): Topic | undefined {
    return TOPICS.find(t => t.id === id);
  }

  getQuizByLevel(level: Level): QuizQuestion[] {
    return QUIZ_QUESTIONS.filter(q => q.level === level);
  }
}
