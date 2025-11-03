import { Routes } from '@angular/router';
import { emailGuard } from './shared/guards/email-guard';
import { socialsGuard } from './shared/guards/socials-guard';

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
            {
                path: 'socials',
                canActivate: [socialsGuard], 
                children: [
                    {
                        path: 'additional',
                        loadComponent: () => import('./features/step-additional/step-additional').then(m => m.StepAdditional)
                    },
                    {
                        path: 'rules',
                        loadComponent: () => import('./features/step-rules/step-rules').then(m => m.StepRules)
                    }
                ] 
            }
        ]
    },
    { path: '**', redirectTo: 'signup/method' },
];
