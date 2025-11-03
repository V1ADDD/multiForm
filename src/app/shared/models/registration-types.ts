// Данные общие
export interface RegistrationData {
    method?: string,
    basicInfo?: BasicInfo,
    additionalInfo?: AdditionalInfo,
    confirmation?: Confirmation
}

// Первый-второй шаг
export interface BasicInfo {
    email: string,
    name: string,
    country: string,
    phone?: string,
    valid: boolean
}

// Третий шаг
export interface AdditionalInfo {
    addressCountry: string,
    addressCity: string,
    addressStreet: string,
    birthDate: Date,
    gender: string,
    parentName?: string,
    parentEmail?: string,
    valid: boolean
}

// Четвертый шаг
export interface Confirmation {
    acceptTerms: boolean,
    acceptPrivacy: boolean,
    subscribe: boolean
}

export type RegistrationStep = 'method' | 'basic' | 'additional' | 'confirmation';

export interface Country {
  code: string;
  name: string;
  phoneCode: string;
}
