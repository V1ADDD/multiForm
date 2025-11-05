import { Routes } from '@angular/router';
import { emailGuard } from './shared/guards/email-guard';
import { socialsGuard } from './shared/guards/socials-guard';
import { FormValidateGuard } from './shared/guards/form-validate-guard';

export const routes: Routes = [
    { 
        path: 'signup',
        children: [
            {
                path: 'method',
                loadComponent: () => import('./features/sign-up/sign-up').then(m => m.SignUp),
            },
            {
                path: 'email',
                canActivate: [emailGuard], 
                children: [
                    {
                        path: 'basic',
                        loadComponent: () => import('./features/step-basic/step-basic').then(m => m.StepBasic),
                    },
                    {
                        path: 'additional',
                        loadComponent: () => import('./features/step-additional/step-additional').then(m => m.StepAdditional),
                        canActivate: [FormValidateGuard]
                    },
                    {
                        path: 'rules',
                        loadComponent: () => import('./features/step-rules/step-rules').then(m => m.StepRules),
                        canActivate: [FormValidateGuard]
                    }
                ] 
            },
            {
                path: 'socials',
                canActivate: [socialsGuard],
                children: [
                    {
                        path: 'additional',
                        loadComponent: () => import('./features/step-additional/step-additional').then(m => m.StepAdditional),
                    },
                    {
                        path: 'rules',
                        loadComponent: () => import('./features/step-rules/step-rules').then(m => m.StepRules),
                        canActivate: [FormValidateGuard]
                    }
                ] 
            }
        ]
    },
    { 
        path: '**',
        loadComponent: () => import('./features/not-found/not-found').then(m => m.NotFound),
    },
];
