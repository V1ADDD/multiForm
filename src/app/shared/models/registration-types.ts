// Данные общие
export interface RegistrationData {
    method?: 'email' | 'social',
    basicInfo?: BasicInfo,
    additionalInfo?: AdditionalInfo,
    confirmation?: Confirmation
}

// Первый-второй шаг
export interface BasicInfo {
    email: string,
    name: string,
    country: string,
    phone?: string
}

// Третий шаг
export interface AdditionalInfo {
    address: Address,
    birthDate: Date,
    gender: string,
    parentInfo?: ParentInfo
}

export interface Address {
    country: string,
    city: string,
    street: string
}

export interface ParentInfo {
    name: string,
    email: string
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
