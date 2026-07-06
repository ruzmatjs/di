import { Topic } from './models';

export const TOPICS: Topic[] = [
  // ============ 1-DARAJA: ASOSLAR ============
  {
    id: 1, level: 1, tag: 'intervyu',
    title: 'DI nima va nima uchun kerak',
    short: "Design pattern sifatida DI, new bilan yaratish muammosi.",
    content: [
      "Dependency Injection — bu class o'ziga kerakli bog'liqliklarni (dependency) o'zi yaratmasdan, tashqaridan tayyor holda olish patterni. Angular'da bu ishni Injector bajaradi: siz \"menga TaskService kerak\" deysiz, Angular uni topib, yaratib (yoki mavjudini olib) sizga beradi.",
      "Nega new ishlatish yomon? Birinchidan — tight coupling: class o'z dependency'sining aniq implementatsiyasiga bog'lanib qoladi, uni almashtirib bo'lmaydi. Ikkinchidan — testlash qiyin: new HttpClient() yozilgan class'ni mock bilan test qilib bo'lmaydi. Uchinchidan — nusxalar ko'payadi: har bir component o'z instance'ini yaratsa, umumiy holat (state) yo'qoladi.",
      "DI bu muammolarni Inversion of Control tamoyili orqali hal qiladi: dependency yaratish mas'uliyati class'dan olinib, tashqi konteynerga (Angular Injector'ga) beriladi. Class faqat \"nima kerakligini\" e'lon qiladi, \"qanday yaratilishini\" bilmaydi.",
    ],
    code: `// ❌ DI'siz — tight coupling
export class TaskListComponent {
  private taskService = new TaskService(new HttpClient(...));
  // testda almashtirib bo'lmaydi, har safar yangi nusxa
}

// ✅ DI bilan — loose coupling
export class TaskListComponent {
  private taskService = inject(TaskService);
  // Angular topib beradi: test'da mock, prod'da real
}`,
    interviewQuestion: "DI nima va u qanday muammolarni hal qiladi? new bilan yaratishdan farqi nimada?",
  },
  {
    id: 2, level: 1, tag: 'intervyu',
    title: '@Injectable() va @Service() dekoratorlari',
    short: "Service e'lon qilishning eski va yangi usullari.",
    content: [
      "@Injectable() dekoratori class'ni DI tizimida qatnasha oladigan qilib belgilaydi. providedIn: 'root' opsiyasi bilan service root injector'da avtomatik ro'yxatdan o'tadi — hech qanday providers massiviga qo'lda qo'shish shart emas.",
      "Angular 22 dan @Service() dekoratori qo'shildi — bu @Injectable({ providedIn: 'root' }) ning qisqartirilgan varianti. U oddiy root-scoped singleton service'lar uchun mo'ljallangan va default holatda root'da provide qilinadi. Muhim cheklov: @Service() constructor orqali injection'ni taqiqlaydi — faqat inject() funksiyasi ishlaydi.",
      "@Injectable() esa murakkab stsenariylar uchun qoladi: providedIn'siz (qo'lda provide qilinadigan), platform darajasida, yoki useFactory kabi konfiguratsiyalar kerak bo'lganda.",
    ],
    code: `// Angular 6–21: klassik usul
@Injectable({ providedIn: 'root' })
export class TaskService {}

// Angular 22+: yangi qisqa usul
@Service() // providedIn: 'root' — default
export class TaskService {
  private http = inject(HttpClient); // faqat inject()!
}

// @Injectable hali ham kerak: qo'lda provide qilish uchun
@Injectable()
export class ScopedService {} // providers: [...] da beriladi`,
    interviewQuestion: "@Injectable({ providedIn: 'root' }) va @Service() farqi nimada? Qachon qaysi birini tanlaysiz?",
  },
  {
    id: 3, level: 1, tag: 'amaliy',
    title: 'Service yaratish va inject qilish',
    short: "constructor injection vs inject() funksiyasi.",
    content: [
      "Dependency'ni olishning ikki usuli bor. Klassik usul — constructor injection: constructor(private taskService: TaskService). Angular constructor parametr tipiga qarab (TypeScript metadata orqali) qaysi token kerakligini aniqlaydi.",
      "Zamonaviy usul — inject() funksiyasi (Angular 14+). U injection context ichida chaqirilishi kerak: field initializer, constructor, yoki factory funksiya ichida. Afzalliklari: inheritance'da constructor'ni takrorlash shart emas, type inference yaxshiroq, va funksiyalarda (masalan, guard, interceptor) ham ishlaydi.",
      "Muhim: inject()'ni lifecycle hook (ngOnInit) yoki oddiy metod ichida chaqirsangiz — runtime xato: 'inject() must be called from an injection context'. Chunki bu payt injection context tugagan bo'ladi.",
    ],
    code: `// Klassik: constructor injection
export class TaskListComponent {
  constructor(private taskService: TaskService) {}
}

// Zamonaviy: inject() — field initializer'da
export class TaskListComponent {
  private taskService = inject(TaskService); // ✅

  ngOnInit() {
    const s = inject(TaskService); // ❌ runtime xato!
    // injection context tashqarisida
  }
}`,
    interviewQuestion: "inject() funksiyasi constructor injection'dan nimasi bilan farq qiladi? inject()'ni qayerda chaqirish mumkin?",
  },
  {
    id: 4, level: 1, tag: 'intervyu',
    title: "providedIn: 'root' — singleton service",
    short: "Root injector'da bitta instance, tree-shakable.",
    content: [
      "providedIn: 'root' — service root Environment Injector'da ro'yxatdan o'tadi va butun ilova bo'ylab bitta instance (singleton) bo'ladi. Qayerdan inject qilmang — hamma joyda ayni bitta obyekt keladi. Shuning uchun service ichidagi holat (state) componentlar orasida umumiy bo'ladi.",
      "Muhim afzallik — tree-shakability. Kompilyator service'ni ro'yxatga class'ning o'z metadata'si orqali oladi (module providers massivi orqali emas). Agar siz bu service'ni hech qayerda inject qilmasangiz — u production bundle'dan butunlay chiqarib tashlanadi. NgModule providers'da bunday emas edi: modulda tursa, bundle'ga tushardi.",
      "Yana bir nuance: root service'lar lazy yaratiladi — ilova ishga tushganda emas, birinchi marta inject qilinganda instance yaratiladi.",
    ],
    code: `@Injectable({ providedIn: 'root' })
export class ProgressService {
  private completed = signal<Set<number>>(new Set());
  // Bu signal BUTUN ilova uchun bitta —
  // HomeComponent ham, QuizComponent ham
  // ayni shu Set'ni ko'radi.
}`,
    interviewQuestion: "providedIn: 'root' nima beradi? Nega u tree-shakable, NgModule providers esa emas?",
  },
  {
    id: 5, level: 1, tag: 'amaliy',
    title: 'Component-level providers',
    short: "Har bir component uchun alohida instance — sandboxing.",
    content: [
      "@Component({ providers: [QuizEngine] }) — service shu component'ning Element Injector'ida ro'yxatdan o'tadi. Natija: har bir component instance uchun service'ning ALOHIDA yangi nusxasi yaratiladi. Component yo'q qilinsa (destroy), service ham u bilan birga yo'qoladi.",
      "Bu \"sandboxing\" pattern deyiladi: har bir component o'z izolyatsiyalangan holatiga ega bo'ladi. Masalan, bitta sahifada 3 ta quiz component tursa, har biri o'z QuizEngine'iga ega — bir-birining javoblarini buzmaydi.",
      "Muhim qoida: child componentlar parent'ning provider'ini ko'radi. Ya'ni QuizComponent'da provide qilingan service uning template'idagi barcha bolalarga ham xuddi shu instance sifatida yetib boradi — chunki DI qidiruvi bolaning o'zidan boshlanib, yuqoriga ko'tariladi va birinchi topilganda to'xtaydi.",
    ],
    code: `@Component({
  selector: 'app-quiz',
  providers: [QuizEngine], // har bir <app-quiz> uchun yangi
  template: \`...\`
})
export class QuizComponent {
  engine = inject(QuizEngine); // shu component'ning shaxsiy nusxasi
}

// providedIn: 'root' bo'lsa ham, providers: [...]
// uni SHU daraxt uchun yangi instance bilan yopib qo'yadi (override).`,
    interviewQuestion: "TaskService providedIn: 'root' va componentda providers: [TaskService] birga tursa, component va uning child'i qaysi instance'ni oladi?",
  },

  // ============ 2-DARAJA: PROVIDER KONFIGURATSIYASI ============
  {
    id: 6, level: 2, tag: 'intervyu',
    title: 'useClass — boshqa class berish',
    short: "Token so'ralganda boshqa implementatsiya qaytarish.",
    content: [
      "Provider — bu \"token → qiymat\" xaritasi. providers: [TaskService] aslida qisqartma: { provide: TaskService, useClass: TaskService }. provide — kalit (token), useClass — shu kalit so'ralganda qaysi class'dan instance yaratish.",
      "useClass'ning kuchi — almashtirishda: { provide: LoggerService, useClass: FileLoggerService }. Endi kim LoggerService so'rasa, FileLoggerService instance'ini oladi — iste'molchi kod o'zgarmaydi. Bu abstraktsiyaga bog'lanish tamoyili (depend on abstractions) va testing'ning asosi.",
      "E'tibor bering: useClass har safar YANGI instance yaratadi. Agar mavjud instance'ga ulanish kerak bo'lsa — useExisting kerak (9-mavzu).",
    ],
    code: `abstract class Logger {
  abstract log(msg: string): void;
}

@Injectable() class ConsoleLogger extends Logger {
  log(msg: string) { console.log(msg); }
}
@Injectable() class ServerLogger extends Logger {
  log(msg: string) { /* API ga yuborish */ }
}

// Muhitga qarab almashtirish:
providers: [
  { provide: Logger,
    useClass: environment.production ? ServerLogger : ConsoleLogger }
]
// Component: private logger = inject(Logger); — qaysi biri kelganini bilmaydi`,
    interviewQuestion: "providers: [TaskService] ning to'liq (full) yozilishi qanday? useClass qachon kerak bo'ladi?",
  },
  {
    id: 7, level: 2, tag: 'amaliy',
    title: 'useValue — tayyor qiymat berish',
    short: "Konfiguratsiya, konstantalar, mock objectlar.",
    content: [
      "useValue token so'ralganda class'dan instance yaratmasdan, tayyor qiymatni qaytaradi: string, number, object, funksiya — istalgan narsa. Eng ko'p ishlatilishi: konfiguratsiya qiymatlari (API URL, feature flag'lar) va testlarda mock objectlar.",
      "Bu loyihaning o'zida ham useValue bor: main.ts da { provide: APP_CONFIG, useValue: DEFAULT_CONFIG }. QuizComponent APP_CONFIG'dan passScore'ni oladi — qiymat bitta joyda o'zgartiriladi, hamma joyga tarqaladi.",
    ],
    code: `// tokens.ts (shu loyihada!)
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

// main.ts
providers: [
  { provide: APP_CONFIG, useValue: { appName: 'DI Learn', passScore: 70 } }
]

// Testda mock berish:
TestBed.configureTestingModule({
  providers: [
    { provide: TaskService, useValue: { getTasks: () => of([]) } }
  ]
});`,
    interviewQuestion: "Testda real service o'rniga mock qanday beriladi? useValue va useClass'ning testdagi roli?",
  },
  {
    id: 8, level: 2, tag: 'amaliy',
    title: 'useFactory — dinamik yaratish',
    short: "Runtime shartiga qarab qaysi qiymat berilishini hal qilish.",
    content: [
      "useFactory — qiymatni funksiya orqali runtime'da hisoblab berish. Qachon kerak: qaysi implementatsiya berilishi runtime ma'lumotiga bog'liq bo'lsa (platforma, foydalanuvchi sozlamasi, feature flag).",
      "Factory funksiya injection context ichida ishlaydi — demak uning ichida inject() chaqirsa bo'ladi. Eski uslubda deps: [...] massivi ishlatilardi, hozir inject() qulayroq.",
    ],
    code: `providers: [
  {
    provide: StorageService,
    useFactory: () => {
      const platformId = inject(PLATFORM_ID);
      return isPlatformBrowser(platformId)
        ? new LocalStorageService()
        : new MemoryStorageService(); // SSR uchun
    }
  }
]`,
    interviewQuestion: "useFactory qachon kerak? Factory ichida boshqa service'ni qanday olasiz?",
  },
  {
    id: 9, level: 2, tag: 'murakkab',
    title: 'useExisting — alias yaratish',
    short: "Ikki token — bitta instance.",
    content: [
      "useExisting yangi instance yaratmaydi — mavjud token'ga havola (alias) qiladi: { provide: OldLogger, useExisting: NewLogger }. Endi OldLogger so'ralganda ham NewLogger'ning AYNI instance'i qaytadi.",
      "useClass bilan farqi kritik: useClass ikkita ALOHIDA instance yaratadi (har token uchun o'zi), useExisting — bitta umumiy. Legacy API migratsiyasida foydali: eski kod eski token bilan ishlayveradi, lekin ostida yangi service turadi.",
    ],
    code: `providers: [
  NewLogger,
  { provide: OldLogger, useClass: NewLogger },   // ❗ 2 ta alohida instance
  // vs
  { provide: OldLogger, useExisting: NewLogger } // ✅ 1 ta umumiy instance
]`,
    interviewQuestion: "useClass va useExisting farqi? Nechta instance yaratiladi har birida?",
  },
  {
    id: 10, level: 2, tag: 'intervyu',
    title: 'InjectionToken — custom token',
    short: "Class bo'lmagan qiymatlar uchun DI kaliti.",
    content: [
      "DI qidiruvi runtime'da token bo'yicha ishlaydi. Class — o'zi token bo'la oladi, chunki u runtime'da mavjud. Lekin interface, string, object — TypeScript kompilyatsiyadan keyin yo'qoladi (type erasure), ular token bo'la olmaydi. Yechim — InjectionToken: runtime'da mavjud bo'lgan maxsus obyekt-kalit.",
      "InjectionToken<T> generic bilan type-safety beradi: inject(API_URL) avtomatik string qaytaradi. Constructor'dagi string parametr ('api.url') — faqat debugging uchun tavsif; Angular tokenlarni obyekt reference bo'yicha taniydi, nom bo'yicha emas.",
      "Factory bilan yaratsangiz token tree-shakable root provider'ga aylanadi — providers massiviga qo'shish shart emas.",
    ],
    code: `export const API_URL = new InjectionToken<string>('api.url');

// Variant 1: providers'da berish
providers: [{ provide: API_URL, useValue: 'https://api.example.com' }]

// Variant 2: factory bilan — o'zi root'da provide bo'ladi
export const API_URL = new InjectionToken<string>('api.url', {
  factory: () => 'https://api.example.com'
});

// Ishlatish:
private apiUrl = inject(API_URL); // type: string ✅`,
    interviewQuestion: "Nega interface'ni to'g'ridan-to'g'ri inject qilib bo'lmaydi? InjectionToken bu muammoni qanday hal qiladi?",
  },
  {
    id: 11, level: 2, tag: 'amaliy',
    title: 'multi: true — bir token, bir nechta provider',
    short: "HTTP_INTERCEPTORS zanjiri qanday ishlaydi.",
    content: [
      "Odatda bitta token uchun oxirgi provider g'olib bo'ladi (override). multi: true bilan esa barcha providerlar SAQLANADI va inject qilganda massiv bo'lib qaytadi.",
      "Klassik misol — HTTP_INTERCEPTORS: bir nechta interceptor ro'yxatdan o'tadi (auth, logging, error handling), Angular ularni zanjir qilib, har bir so'rovni ketma-ket o'tkazadi. APP_INITIALIZER ham shunday ishlaydi.",
      "Diqqat: bitta tokenda multi: true va multi'siz providerlarni aralashtirsangiz — xato. Hammasi bir xil bo'lishi kerak.",
    ],
    code: `providers: [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LogInterceptor,  multi: true },
]
// inject(HTTP_INTERCEPTORS) → [AuthInterceptor, LogInterceptor]

// Zamonaviy functional uslub (Angular 15+):
provideHttpClient(withInterceptors([authInterceptor, logInterceptor]))`,
    interviewQuestion: "multi: true nima qiladi? HTTP_INTERCEPTORS qanday ishlaydi?",
  },

  // ============ 3-DARAJA: INJECTOR TREE VA RESOLUTION ============
  {
    id: 12, level: 3, tag: 'intervyu',
    title: 'Hierarchical Injector Tree',
    short: "Qidiruv: o'zidan → yuqoriga → root → NullInjectorError.",
    content: [
      "Angular'da injector bitta emas — daraxt (tree). Har bir component/directive o'z Element Injector'iga ega bo'lishi mumkin (providers bergan bo'lsa), ularning tepasida Environment Injector (root) turadi.",
      "Dependency so'ralganda qidiruv tartibi: (1) so'ragan component'ning o'z injector'i, (2) parent component injector'lari bo'ylab yuqoriga, (3) Environment/root injector, (4) hech qayerda topilmasa — NullInjectorError: No provider for X!",
      "Bu xato RUNTIME'da chiqadi — chunki DI resolution component instantiate bo'layotganda amalga oshadi, kompilyatsiya paytida emas. (Solishtiring: template'da noma'lum component — compile-time NG8001 xatosi.)",
      "Muhim: qidiruv birinchi topilgan joyda TO'XTAYDI. Shuning uchun component-level provider root'dagi singleton'ni \"yopib qo'yadi\" (shadowing) — pastdagi daraxt uchun.",
    ],
    code: `// Qidiruv zanjiri:
// TaskItemComponent  ← so'radi, o'zida yo'q
//   ↑ TaskListComponent  ← providers: [TaskService] BOR → SHU beriladi
//     ↑ AppComponent
//       ↑ Root Environment Injector ← providedIn: 'root' (yetib bormaydi)
//         ↑ NullInjector → xato (yetib bormaydi)`,
    interviewQuestion: "Angular DI qidiruvi qanday tartibda ishlaydi? NullInjectorError qachon va nega runtime'da chiqadi?",
  },
  {
    id: 13, level: 3, tag: 'murakkab',
    title: 'Environment vs Element Injector',
    short: "Ikki parallel ierarxiya va ularning kesishishi.",
    content: [
      "Aslida ikkita parallel injector ierarxiyasi bor. Element Injector'lar — DOM daraxti bo'ylab: component va directive providers'lari shu yerda. Environment Injector'lar — konfiguratsiya darajasida: bootstrapApplication providers, route providers (lazy route har biriga o'z environment injector'i yaratiladi).",
      "Qidiruv tartibi: avval Element Injector daraxti to'liq (component'dan root component'gacha), keyin Environment Injector daraxti (route → root). Ya'ni component provider har doim route yoki root provider'dan ustun.",
    ],
    code: `// Ikki daraxt:
// ELEMENT:      TaskItem → TaskList → App
//                                      ↓ (keyin)
// ENVIRONMENT:  Lazy Route Injector → Root Injector → Platform → NullInjector`,
    interviewQuestion: "Element Injector va Environment Injector farqi nimada? Qidiruvda qaysi biri birinchi tekshiriladi?",
  },
  {
    id: 14, level: 3, tag: 'intervyu',
    title: '@Self() — faqat o\'zidan qidirish',
    short: "Yuqoriga chiqmaslik kafolati.",
    content: [
      "@Self() (yoki inject(Token, { self: true })) qidiruvni faqat so'ragan element'ning O'Z injector'i bilan cheklaydi. Yuqoriga chiqmaydi. Topilmasa — darhol NullInjectorError.",
      "Qachon kerak: component/directive ANIQ o'zining lokal instance'i bilan ishlashi kafolatlanishi kerak bo'lganda. Masalan, directive faqat o'ziga biriktirilgan NgControl bilan ishlashi kerak, tasodifan parent'nikini olib qo'ymasligi kerak.",
    ],
    code: `@Directive({ selector: '[appValidator]' })
export class ValidatorDirective {
  // Faqat SHU elementdagi NgControl — parent formani emas
  private control = inject(NgControl, { self: true, optional: true });
}`,
    interviewQuestion: "@Self() nima qiladi va qanday real holatda kerak bo'ladi?",
  },
  {
    id: 15, level: 3, tag: 'intervyu',
    title: "@SkipSelf() — o'zini tashlab ketish",
    short: "Parent instance'ni olish — rekursiv strukturalar.",
    content: [
      "@SkipSelf() — @Self()'ning teskarisi: qidiruv o'z injector'ini o'tkazib yuborib, PARENT'dan boshlanadi. Klassik holat: component o'zida service provide qilgan, lekin unga parent'ning instance'i ham kerak (masalan, daraxtsimon/rekursiv componentlar, nested formalar).",
      "Amaliy misol: TreeNodeComponent har biri o'z NodeState'ini provide qiladi, lekin parent node'ning state'iga ham ulanishi kerak — @SkipSelf() bilan parent instance olinadi, o'ziniki esa oddiy inject bilan.",
    ],
    code: `@Component({
  selector: 'app-tree-node',
  providers: [NodeState], // har node o'ziga
})
export class TreeNodeComponent {
  own = inject(NodeState);                            // o'ziniki
  parent = inject(NodeState, { skipSelf: true,        // parent'niki
                               optional: true });     // root node'da parent yo'q
}`,
    interviewQuestion: "@SkipSelf() qanday ishlaydi? Nega u ko'pincha @Optional() bilan birga ishlatiladi?",
  },
  {
    id: 16, level: 3, tag: 'intervyu',
    title: '@Optional() — xato o\'rniga null',
    short: "NullInjectorError'dan himoya. Runtime'da ishlaydi!",
    content: [
      "@Optional() (inject(Token, { optional: true })) — dependency topilmasa NullInjectorError tashlash o'rniga null qaytaradi. Bu RUNTIME xatti-harakati — compile-time bilan hech qanday aloqasi yo'q (keng tarqalgan chalkashlik!).",
      "Qachon kerak: dependency haqiqatan ixtiyoriy bo'lganda. Masalan, directive formada ham, formasiz ham ishlashi mumkin; yoki @SkipSelf() bilan parent qidirilganda root elementda parent bo'lmaydi.",
      "Type'ga e'tibor: optional inject T | null qaytaradi — TypeScript null-check talab qiladi.",
    ],
    code: `// optional: true → topilmasa null (xato emas)
private theme = inject(ThemeService, { optional: true });
// type: ThemeService | null

ngOnInit() {
  this.theme?.apply(); // null-safe ishlatish
}`,
    interviewQuestion: "@Optional() compile-time'dami yoki runtime'da ishlaydi? Nima qaytaradi topilmasa?",
  },
  {
    id: 17, level: 3, tag: 'amaliy',
    title: '@Host() — host chegarasi',
    short: "Qidiruvni host component'da to'xtatish.",
    content: [
      "@Host() qidiruvni joriy element'dan boshlab HOST component'gacha (shu jumladan) cheklaydi — undan yuqoriga chiqmaydi. Host — directive turgan template'ning egasi bo'lgan component.",
      "Eng ko'p uchraydigan joyi — forma directive'lari: input ichidagi validator directive o'zining eng yaqin form container'idan (ControlContainer) nariga o'tmasligi kerak. Aks holda nested formalar bir-birining container'ini olib chalkashadi.",
    ],
    code: `@Directive({ selector: '[appFormField]' })
export class FormFieldDirective {
  // Eng yaqin form'gacha qidiradi, undan yuqoriga o'tmaydi
  private container = inject(ControlContainer, { host: true, optional: true });
}`,
    interviewQuestion: "@Host() va @Self() farqi nimada? Forma directive'larida nega @Host() muhim?",
  },
  {
    id: 18, level: 3, tag: 'amaliy',
    title: 'Route-level providers',
    short: "Feature'ga izolyatsiya qilingan service'lar.",
    content: [
      "Route konfiguratsiyasida providers berish mumkin — bu route (va uning bolalari) uchun alohida Environment Injector yaratadi. Service faqat shu feature ichida mavjud bo'ladi va lazy route bo'lsa, service kodi ham route bilan birga lazy yuklanadi.",
      "Bu eski NgModule providers'ning zamonaviy o'rnini bosuvchisi: feature isolation — admin service'lari faqat /admin ichida, boshqa joyda inject qilib bo'lmaydi.",
    ],
    code: `export const routes: Routes = [
  {
    path: 'admin',
    providers: [AdminService, AuditLogService], // faqat shu daraxtda
    loadComponent: () => import('./admin/admin.component')
      .then(c => c.AdminComponent),
  },
];`,
    interviewQuestion: "Route-level providers qachon kerak? Lazy route'da provider qanday yuklanadi?",
  },

  // ============ 4-DARAJA: ILG'OR MAVZULAR ============
  {
    id: 19, level: 4, tag: 'murakkab',
    title: 'forwardRef() — circular reference',
    short: "Hali e'lon qilinmagan class'ga havola.",
    content: [
      "JavaScript'da class hoisting yo'q — class e'lon qilinishidan OLDIN unga murojaat qilib bo'lmaydi. Provider konfiguratsiyasida ba'zan shunday holat chiqadi: token pastroqda e'lon qilingan class'ga ishora qilishi kerak. forwardRef(() => MyClass) muammoni hal qiladi: reference'ni darhol emas, kerak bo'lganda (lazy) oladi.",
      "Klassik holatlar: (1) parent-child component bir-biriga ishora qilganda, (2) NG_VALUE_ACCESSOR provide qilishda component o'z-o'ziga ishora qiladi. Lekin ogohlik: agar ikkita SERVICE bir-birini inject qilsa — bu ko'pincha dizayn xatosi belgisi; forwardRef'dan oldin arxitekturani qayta ko'rish kerak (uchinchi umumiy service ajratish).",
    ],
    code: `// ControlValueAccessor: component hali to'liq e'lon qilinmagan
// paytda o'ziga ishora qilishi kerak
@Component({
  selector: 'app-rating',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => RatingComponent), // ⬅
    multi: true,
  }],
})
export class RatingComponent implements ControlValueAccessor { ... }`,
    interviewQuestion: "forwardRef nima uchun kerak? Ikkita service bir-birini inject qilsa nima qilasiz?",
  },
  {
    id: 20, level: 4, tag: 'murakkab',
    title: 'injectAsync() — lazy service (Angular 22)',
    short: "Service'ni faqat kerak bo'lganda yuklash.",
    content: [
      "Angular 22 da injectAsync() qo'shildi — service'ni asinxron, faqat haqiqatan kerak bo'lganda yuklash imkoniyati. injectAsync qaytargan narsa instance emas — funksiya; uni chaqirib await qilganda service yuklanadi va instance keladi.",
      "Maqsad — initial bundle size: og'ir service (masalan, PDF generator, chart engine) foydalanuvchi tugma bosmaguncha umuman yuklanmasin. Shart: service providedIn: 'root' (yoki @Service()) bo'lishi kerak.",
    ],
    code: `export class ReportComponent {
  private loadPdf = injectAsync(PdfGeneratorService);

  async onExport() {
    const pdf = await this.loadPdf(); // shu yerda yuklanadi
    pdf.generate(this.data);
  }
}`,
    interviewQuestion: "injectAsync oddiy inject'dan nimasi bilan farq qiladi va qanday muammoni hal qiladi?",
  },
  {
    id: 21, level: 4, tag: 'intervyu',
    title: 'Tree-shaking va DI',
    short: "Nega providedIn: 'root' bundle'ni kichraytiradi.",
    content: [
      "Tree-shaking — bundler (esbuild/webpack) ishlatilmagan kodni production bundle'dan chiqarib tashlashi. Buning sharti: kod ishlatilishini STATIK aniqlash mumkin bo'lishi kerak.",
      "providedIn: 'root' da bog'liqlik yo'nalishi: service o'zi \"men root'da turaman\" deydi. Uni hech kim import qilib inject qilmasa — unga hech qanday reference yo'q, bundler o'chirib tashlaydi. NgModule providers'da esa teskari: MODUL service'ni import qiladi. Modul ilovada ishlatilsa, uning providers'idagi hamma narsa — inject qilinmagan bo'lsa ham — bundle'ga tortiladi.",
      "Shu sababli rasmiy tavsiya: har doim providedIn: 'root' (yoki @Service()) — modul providers emas.",
    ],
    code: `// providedIn: 'root' — reference yo'nalishi:
// [Component] --inject--> [Service]     inject yo'q → service o'chadi ✅

// NgModule providers — reference yo'nalishi:
// [Module] --providers--> [Service]     modul bor → service qoladi ❌`,
    interviewQuestion: "Nega providedIn: 'root' tree-shakable, module providers esa emas? Reference yo'nalishi orqali tushuntiring.",
  },
  {
    id: 22, level: 4, tag: 'murakkab',
    title: 'Platform / Root / Element — 3 daraja',
    short: "providedIn: 'platform' qachon kerak.",
    content: [
      "To'liq ierarxiya tepadan pastga: NullInjector (har doim xato tashlaydi) → Platform Injector (providedIn: 'platform' — bitta sahifadagi BIR NECHTA Angular ilova o'rtasida umumiy) → Root Environment Injector (providedIn: 'root') → Route Environment Injector'lar → Element Injector'lar.",
      "providedIn: 'platform' kamdan-kam kerak: micro-frontend arxitekturada bitta sahifada 2-3 ta bootstrapApplication ishlasa va ular umumiy service'ga (masalan, umumiy event bus) muhtoj bo'lsa.",
    ],
    code: `@Injectable({ providedIn: 'platform' })
export class CrossAppEventBus {} // barcha Angular ilovalar uchun bitta

// Ierarxiya:
// NullInjector → Platform → Root → Route → ... → Element`,
    interviewQuestion: "providedIn: 'root' va 'platform' farqi? Qachon platform kerak bo'ladi?",
  },

  // ============ 5-DARAJA: REAL-WORLD PATTERNS ============
  {
    id: 23, level: 5, tag: 'intervyu',
    title: 'Testing: TestBed va mock providers',
    short: "DI — testlanuvchanlikning asosi.",
    content: [
      "DI'ning eng katta amaliy foydasi testlarda ko'rinadi: TestBed.configureTestingModule({ providers: [...] }) orqali istalgan service'ni test dublyori bilan almashtirasiz — component kodi bir qatorga ham o'zgarmaydi.",
      "Uch usul: useValue bilan oddiy mock object, useClass bilan MockService class, jasmine.createSpyObj bilan spy (chaqiruvlarni kuzatish mumkin). TestBed.inject(Service) — testda service instance olish.",
    ],
    code: `describe('TaskListComponent', () => {
  let mockTasks: jasmine.SpyObj<TaskService>;

  beforeEach(() => {
    mockTasks = jasmine.createSpyObj('TaskService', ['getTasks']);
    mockTasks.getTasks.and.returnValue(of([{ id: 1, title: 'Test' }]));

    TestBed.configureTestingModule({
      imports: [TaskListComponent], // standalone → imports!
      providers: [{ provide: TaskService, useValue: mockTasks }],
    });
  });

  it('loads tasks', () => {
    const fixture = TestBed.createComponent(TaskListComponent);
    fixture.detectChanges();
    expect(mockTasks.getTasks).toHaveBeenCalled();
  });
});`,
    interviewQuestion: "Componentni real HTTP'siz qanday test qilasiz? Spy object nima beradi?",
  },
  {
    id: 24, level: 5, tag: 'amaliy',
    title: 'Interceptor pattern',
    short: "Functional vs class-based interceptorlar.",
    content: [
      "HTTP Interceptor — har bir so'rov/javobni o'tkazuvchi zanjir: auth token qo'shish, xatolarni markazlashgan ushlash, loading indikator. Angular 15+ da functional interceptorlar tavsiya etiladi: oddiy funksiya, inject() bilan dependency oladi, withInterceptors() ga ro'yxat qilib beriladi — tartib muhim (birinchi yozilgani birinchi ishlaydi).",
      "Eski class-based usul HTTP_INTERCEPTORS + multi: true bilan ishlar edi — bu multi provider patternning jonli misoli (11-mavzu).",
    ],
    code: `// Functional interceptor (Angular 15+)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService); // funksiyada ham inject ishlaydi!
  const cloned = req.clone({
    setHeaders: { Authorization: \`Bearer \${auth.token()}\` }
  });
  return next(cloned);
};

// Ro'yxatdan o'tkazish:
provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))`,
    interviewQuestion: "Functional va class-based interceptor farqi? Interceptorlar qanday tartibda ishlaydi?",
  },
  {
    id: 25, level: 5, tag: 'amaliy',
    title: 'Real loyihada DI arxitektura',
    short: "Singleton yoki scoped — qanday qaror qilinadi.",
    content: [
      "Qaror daraxti: (1) Holat butun ilovaga umumiy bo'lishi kerakmi (auth, foydalanuvchi, global sozlamalar)? → providedIn: 'root'. (2) Holat feature'ga tegishlimi (admin panel ichki holati)? → route providers. (3) Har bir component nusxasi o'z holatiga ega bo'lishi kerakmi (quiz engine, wizard step)? → component providers.",
      "Konfiguratsiya (URL'lar, flag'lar) — InjectionToken + useValue, environment fayldan. Almashtiriladigan implementatsiyalar (storage, logger) — abstract class token + useClass/useFactory. Kesuvchi vazifalar (auth header, xatolar) — interceptor.",
      "Shu loyihaning o'zi namuna: ProgressService — root singleton (progress hamma sahifada umumiy), QuizEngine — component provider (har quiz o'z holatida), APP_CONFIG — InjectionToken + useValue.",
    ],
    code: `// Shu ilovaning DI xaritasi:
// ProgressService  → providedIn: 'root'   (umumiy progress)
// TopicsService    → providedIn: 'root'   (ma'lumotlar, stateless)
// QuizEngine       → component providers  (har quiz alohida)
// APP_CONFIG       → InjectionToken + useValue (konfiguratsiya)`,
    interviewQuestion: "Yangi service yaratayotganda root, route yoki component darajasini qanday tanlaysiz?",
  },
];
