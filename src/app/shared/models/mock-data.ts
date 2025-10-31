import { Country, RegistrationData } from "./registration-types";

// список стран для выбора
export const countries: Country[] = [
    { code: 'by', name: 'Беларусь', phoneCode: '+375' },
    { code: 'ru', name: 'Россия', phoneCode: '+7' },
    { code: 'us', name: 'США', phoneCode: '+1' },
    { code: 'de', name: 'Германия', phoneCode: '+49' },
    { code: 'fr', name: 'Франция', phoneCode: '+33' },
    { code: 'it', name: 'Италия', phoneCode: '+39' },
    { code: 'es', name: 'Испания', phoneCode: '+34' },
    { code: 'jp', name: 'Япония', phoneCode: '+81' },
    { code: 'cn', name: 'Китай', phoneCode: '+86' }
];

export const genders: string[] = [
    'Мужской',
    'Женский',
    'Другой'
]

// моковый юсер
export const mockUser: RegistrationData = {
    method: 'social',
    basicInfo: {
        email: 'john@doe.com',
        name: 'John',
        country: 'by',
        phone: '(029) 111-22-33',
        valid: true
    }
}