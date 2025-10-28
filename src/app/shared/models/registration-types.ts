// Данные общие
export type RegistrationData = {
    method?: 'email' | 'social',
    basicInfo?: BasicInfo,
    additionalInfo?: AdditionalInfo,
    confirmation?: Confirmation
}

// Первый-второй шаг
export type BasicInfo = {
    email: string,
    name: string,
    country: string,
    phone?: string
}

// Третий шаг
export type AdditionalInfo = {
    address: Address,
    birthDate: Date,
    gender: string,
    parentInfo?: ParentInfo
}

export type Address = {
    country: string,
    city: string,
    street: string
}

export type ParentInfo = {
    name: string,
    email: string
}

// Четвертый шаг
export type Confirmation = {
    acceptTerms: boolean,
    acceptPrivacy: boolean,
    subscribe: boolean
}

export type RegistrationStep = 'method' | 'basic' | 'additional' | 'confirmation';

export type Country = {
  code: string;
  name: string;
  phoneCode: string;
}

export type Field = {
    label: string;
    name: string;
    type: string;
    errorMes: string;
}