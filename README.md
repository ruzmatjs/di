# DI Learn — Angular Dependency Injection o'quv ilovasi

Angular DI'ni o'rganish uchun ilova — **loyihaning o'zi ham o'quv materiali**: kodda barcha asosiy DI patternlar real ishlatilgan va `DI DARSLIGI` kommentlari bilan belgilangan.

## Ishga tushirish

```bash
npm install
npm start
# http://localhost:4200
```

## Imkoniyatlar

- **25 mavzu, 5 daraja** — asoslardan (DI nima) ilg'or mavzulargacha (forwardRef, injectAsync)
- Har mavzuda: tushuntirish, kod misoli, intervyu savoli
- **Har daraja uchun quiz** — 3 savol, izohli javoblar, 70% o'tish chegarasi
- Progress localStorage'da saqlanadi

## Loyihaning DI xaritasi (kodni o'qib o'rganing!)

| Pattern | Qayerda | Nima uchun |
|---|---|---|
| `providedIn: 'root'` singleton | `ProgressService`, `TopicsService` | Progress hamma sahifada umumiy |
| Component-level provider | `QuizComponent` → `providers: [QuizEngine]` | Har quiz o'z holatida (sandboxing), sahifadan chiqilganda tozalanadi |
| `InjectionToken` + `useValue` | `APP_CONFIG` (main.ts) | Class bo'lmagan konfiguratsiyani inject qilish |
| `inject()` funksiyasi | Hamma joyda | Zamonaviy injection uslubi |
| `loadComponent` lazy loading | `app.routes.ts` | Har sahifa alohida chunk |
| Signals + immutable update | `ProgressService`, `QuizEngine` | `new Set(...)` / `new Map(...)` — mutatsiya emas |
| `input()` + route binding | `TopicDetailComponent`, `QuizComponent` | `withComponentInputBinding` bilan `:id` to'g'ridan-to'g'ri input |

## O'zingiz sinab ko'rish uchun mashqlar

1. `QuizComponent`dagi `providers: [QuizEngine]`ni olib tashlab, `QuizEngine`ga `providedIn: 'root'` qo'ying — quizni ikki marta ochib nima buzilishini kuzating (eski javoblar qoladi).
2. `APP_CONFIG`da `passScore`ni 90 ga o'zgartiring — quiz natijasi sahifasi qanday o'zgaradi?
3. `ProgressService.toggle()`da `new Set(set)` o'rniga to'g'ridan-to'g'ri `set.add(id)` qilib ko'ring — UI nega yangilanmay qolishini tushuntiring (signal + reference equality).
