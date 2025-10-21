export type RegistrationData = {
    method?: 'email' | 'social',
    basicInfo?: BasicInfo,
    additionalInfo?: AdditionalInfo,
    confirmation?: Confirmation
}

export type BasicInfo = {
    email: string,
    name: string,
    country: string,
    phone?: string
}

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