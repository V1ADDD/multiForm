import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo:'/signup', pathMatch: 'full'},
    {
        path: 'signup', 
        children: [
            {
                path: '',
                redirectTo: 'method',
                pathMatch: 'full'
            },
            {
                path: 'method',
                loadComponent: () => import('./features/sign-up/sign-up').then(m => m.SignUp)
            },
            {
                path: 'basic',
                loadComponent: () => import('./features/step-basic/step-basic').then(m => m.StepBasic)
            },
            {
                path: 'additional',
                loadComponent: () => import('./features/step-additional/step-additional').then(m => m.StepAdditional)
            },
            {
                path: 'rules',
                loadComponent: () => import('./features/step-rules/step-rules').then(m => m.StepRules)
            }
        ] 
    },
    { path: '**', redirectTo: 'signup' },
];
