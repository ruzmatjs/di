import { InjectionToken } from '@angular/core';

/** Ilova konfiguratsiyasi — class emas, oddiy object.
 *  DI DARSLIGI: class bo'lmagan qiymatlarni inject qilish uchun InjectionToken kerak,
 *  chunki interface/object'lar runtime'da mavjud emas (TypeScript o'chirib yuboradi),
 *  DI esa runtime'da token bo'yicha qidiradi. */
export interface AppConfig {
  appName: string;
  passScore: number; // quizdan o'tish uchun minimal foiz
  storageKey: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export const DEFAULT_CONFIG: AppConfig = {
  appName: 'DI Learn',
  passScore: 70,
  storageKey: 'di-learn-progress',
};
