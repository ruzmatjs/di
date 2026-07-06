import { Routes } from '@angular/router';

/** DI DARSLIGI: loadComponent — standalone lazy loading.
 *  Har bir sahifa alohida chunk bo'lib, kerak bo'lganda yuklanadi. */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(c => c.HomeComponent),
  },
  {
    path: 'topic/:id',
    loadComponent: () =>
      import('./pages/topic-detail/topic-detail.component').then(c => c.TopicDetailComponent),
  },
  {
    path: 'quiz/:level',
    loadComponent: () =>
      import('./pages/quiz/quiz.component').then(c => c.QuizComponent),
  },
  { path: '**', redirectTo: '' },
];
