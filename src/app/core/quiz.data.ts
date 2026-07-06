import { QuizQuestion } from './models';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ===== 1-daraja =====
  {
    id: 1, level: 1,
    question: "TaskService providedIn: 'root' bilan yaratilgan. Uni 5 ta turli componentda inject qilsangiz, nechta instance yaratiladi?",
    options: ["5 ta — har component uchun bittadan", "1 ta — hammasi uchun umumiy", "2 ta — parent va child uchun alohida", "0 ta — provide qilinmagan"],
    correctIndex: 1,
    explanation: "providedIn: 'root' — root injector'da bitta singleton. Qayerdan inject qilinmasin, ayni bitta instance qaytadi. Shu sababli service ichidagi holat componentlar orasida umumiy bo'ladi.",
  },
  {
    id: 2, level: 1,
    question: "Quyidagi kodda nima muammo bor?",
    code: `export class TaskListComponent {
  ngOnInit() {
    this.service = inject(TaskService);
  }
}`,
    options: ["Hech qanday muammo yo'q", "inject() faqat constructor'da ishlaydi", "inject() injection context tashqarisida — runtime xato", "TaskService @Injectable emas"],
    correctIndex: 2,
    explanation: "inject() faqat injection context ichida ishlaydi: field initializer, constructor yoki factory. ngOnInit chaqirilganda context tugagan — 'inject() must be called from an injection context' xatosi chiqadi.",
  },
  {
    id: 3, level: 1,
    question: "@Component({ providers: [QuizEngine] }) bilan e'lon qilingan component sahifada 3 marta ishlatilsa, nechta QuizEngine instance bo'ladi?",
    options: ["1 ta — singleton", "3 ta — har component instance'iga bittadan", "6 ta — component va template uchun", "Xato chiqadi"],
    correctIndex: 1,
    explanation: "Component-level provider har bir component instance uchun ALOHIDA service nusxasini yaratadi (sandboxing). Component destroy bo'lsa, service ham yo'qoladi.",
  },

  // ===== 2-daraja =====
  {
    id: 4, level: 2,
    question: "providers: [{ provide: OldLogger, useClass: NewLogger }, NewLogger] — OldLogger va NewLogger inject qilinsa, nechta instance yaratiladi?",
    options: ["1 ta umumiy", "2 ta alohida", "Xato — bitta class ikki marta", "0 ta — abstract class"],
    correctIndex: 1,
    explanation: "useClass har bir token uchun ALOHIDA instance yaratadi — bu yerda 2 ta NewLogger nusxasi bo'ladi. Bitta umumiy instance kerak bo'lsa — useExisting ishlatiladi.",
  },
  {
    id: 5, level: 2,
    question: "Nega TypeScript interface'ni to'g'ridan-to'g'ri inject qilib bo'lmaydi?",
    options: ["Interface'lar private bo'ladi", "Interface runtime'da mavjud emas — type erasure", "Angular interfacelarni qo'llab-quvvatlamaydi", "Interface faqat NgModule'da ishlaydi"],
    correctIndex: 1,
    explanation: "TypeScript tiplar kompilyatsiyadan keyin o'chiriladi (type erasure). DI esa runtime'da token bo'yicha qidiradi. Yechim — InjectionToken: runtime'da mavjud obyekt-kalit.",
  },
  {
    id: 6, level: 2,
    question: "HTTP_INTERCEPTORS bilan 3 ta interceptor ro'yxatdan o'tkazish uchun provider'da nima bo'lishi shart?",
    options: ["useFactory", "multi: true", "providedIn: 'root'", "@Optional()"],
    correctIndex: 1,
    explanation: "multi: true bo'lmasa, oxirgi provider avvalgilarini override qiladi. multi: true bilan barcha providerlar saqlanadi va massiv sifatida qaytadi — interceptor zanjiri shunga quriladi.",
  },

  // ===== 3-daraja =====
  {
    id: 7, level: 3,
    question: "TaskService providedIn: 'root'. TaskListComponent'da providers: [TaskService] ham bor. TaskItemComponent (child) inject qilsa, qaysi instance keladi?",
    options: ["Root'dagi singleton", "TaskListComponent'ning lokal instance'i", "O'zining yangi instance'i", "NullInjectorError"],
    correctIndex: 1,
    explanation: "Qidiruv pastdan yuqoriga boradi va BIRINCHI topilganda to'xtaydi: TaskItem'da yo'q → parent TaskList'da BOR → shu beriladi. Component provider root singleton'ni shu daraxt uchun 'yopib qo'yadi' (shadowing).",
  },
  {
    id: 8, level: 3,
    question: "inject(ThemeService, { optional: true }) — service topilmasa nima bo'ladi va bu qachon aniqlanadi?",
    options: ["Compile-time'da xato", "Runtime'da NullInjectorError", "Runtime'da null qaytadi", "undefined qaytadi compile-time'da"],
    correctIndex: 2,
    explanation: "optional: true — RUNTIME xatti-harakati: topilmasa xato o'rniga null qaytadi. Compile-time bilan aloqasi yo'q — bu keng tarqalgan chalkashlik. Type: ThemeService | null bo'ladi.",
  },
  {
    id: 9, level: 3,
    question: "Rekursiv TreeNodeComponent (har biri providers: [NodeState]) parent node'ning state'ini olishi uchun nima kerak?",
    code: `parent = inject(NodeState, { ??? });`,
    options: ["{ self: true }", "{ skipSelf: true, optional: true }", "{ host: true }", "{ optional: true }"],
    correctIndex: 1,
    explanation: "skipSelf — o'z injector'ini tashlab, parent'dan qidiradi. optional — root node'da parent yo'qligi uchun (aks holda NullInjectorError). Bu ikkalasi klassik juftlik.",
  },

  // ===== 4-daraja =====
  {
    id: 10, level: 4,
    question: "Nega NgModule providers'dagi service tree-shakable emas, providedIn: 'root' esa tree-shakable?",
    options: ["NgModule eskirgan sintaksis", "Modul service'ga reference tutadi — bundler o'chira olmaydi", "providedIn maxsus kompilyator flagi qo'yadi", "Farqi yo'q, ikkalasi ham tree-shakable"],
    correctIndex: 1,
    explanation: "Gap reference yo'nalishida: modul → service reference'i modul ishlatilsa service'ni ham bundle'da ushlab qoladi. providedIn: 'root' da esa service'ga faqat inject qilgan kod reference beradi — inject yo'q bo'lsa, service o'chadi.",
  },
  {
    id: 11, level: 4,
    question: "ControlValueAccessor provide qilishda forwardRef(() => RatingComponent) nima uchun kerak?",
    options: ["Performance uchun", "Class hali to'liq e'lon qilinmagan paytda unga havola berish uchun", "Circular import'ni tezlashtirish uchun", "Angular 22 talabi"],
    correctIndex: 1,
    explanation: "Provider metadata class e'loni ICHIDA turadi — bu paytda class binding hali tugallanmagan. forwardRef reference olishni kechiktiradi (lazy): DI unga haqiqatan murojaat qilganda class allaqachon mavjud bo'ladi.",
  },
  {
    id: 12, level: 4,
    question: "injectAsync(PdfService) nima qaytaradi?",
    options: ["PdfService instance'ini", "Promise<PdfService>", "Chaqirilganda service'ni yuklab beradigan funksiya", "Observable<PdfService>"],
    correctIndex: 2,
    explanation: "injectAsync instance emas, funksiya qaytaradi. Uni chaqirib await qilganingizda service kodi yuklanadi va instance keladi. Maqsad — og'ir service'larni initial bundle'dan chiqarish.",
  },

  // ===== 5-daraja =====
  {
    id: 13, level: 5,
    question: "Testda TaskService'ning getTasks() chaqirilganini tekshirish kerak. Eng to'g'ri yondashuv?",
    options: ["Real service'ni ishlatib, HTTP'ni kuzatish", "useValue bilan jasmine.createSpyObj berish", "Service kodini testga ko'chirish", "getTasks'ni private qilish"],
    correctIndex: 1,
    explanation: "SpyObj — chaqiruvlarni kuzatadigan mock: expect(spy.getTasks).toHaveBeenCalled(). TestBed providers'da useValue orqali beriladi — component kodi o'zgarmaydi, HTTP umuman ishlamaydi.",
  },
  {
    id: 14, level: 5,
    question: "withInterceptors([authInt, logInt, errorInt]) — so'rov qaysi tartibda o'tadi?",
    options: ["Teskari: error → log → auth", "Yozilgan tartibda: auth → log → error", "Parallel", "Alfavit bo'yicha"],
    correctIndex: 1,
    explanation: "So'rov ro'yxat tartibida o'tadi (auth birinchi), javob esa teskari tartibda qaytadi. Shuning uchun auth odatda birinchi (token hamma so'rovga kerak), error handling oxirida yoziladi.",
  },
  {
    id: 15, level: 5,
    question: "Wizard component: har bir ochilgan wizard o'z qadamlar holatiga ega bo'lishi, wizard yopilganda holat tozalanishi kerak. Service qayerda provide qilinadi?",
    options: ["providedIn: 'root'", "providedIn: 'platform'", "Component providers", "Route providers"],
    correctIndex: 2,
    explanation: "Component provider: har bir wizard instance'iga alohida service, component destroy bo'lganda service ham yo'qoladi — hech qanday qo'lda tozalash kerak emas. Root bo'lsa holat wizardlar orasida 'oqib' qolardi.",
  },
];
