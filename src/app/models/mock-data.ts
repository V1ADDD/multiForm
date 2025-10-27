import { Country, RegistrationData, Field } from "./registration-types";

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

// список полей формы step basic
export const stepBasicFields: Field[] = [
    {
        label: 'Email',
        name: 'email',
        type: 'email',
        errorMes: 'Введите корректный email'
    },
    {
        label: 'Имя',
        name: 'name',
        type: 'text',
        errorMes: 'Имя должно содержать минимум 2 символа без спецсимволов'
    },
    {
        label: 'Страна',
        name: 'country',
        type: 'select',
        errorMes: 'Пожалуйста, выберите страну'
    },
    {
        label: 'Телефон',
        name: 'phone',
        type: 'tel',
        errorMes: 'Введите корректный номер телефона'
    },
]

// моковый юсер
export const mockUser: RegistrationData = {
    method: 'social',
    basicInfo: {
        email: 'john@doe.com',
        name: 'John Doe',
        country: 'by',
        phone: '(029) 111-22-33'
    },
    additionalInfo: {
        address: {
            country: 'Беларусь',
            city: 'Минск',
            street: 'Жукова'
        },
        birthDate: new Date('1990-01-01'),
        gender: 'другой'
    }
}