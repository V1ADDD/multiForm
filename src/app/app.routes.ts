import { Routes } from '@angular/router';
import { SignUp } from './features/sign-up/sign-up';
import { StepBasic } from './features/step-basic/step-basic';
import { StepAdditional } from './features/step-additional/step-additional';
import { StepRules } from './features/step-rules/step-rules';

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
                component: SignUp
            },
            {
                path: 'basic',
                component: StepBasic
            },
            {
                path: 'additional',
                component: StepAdditional
            },
            {
                path: 'rules',
                component: StepRules
            }
        ] 
    },
    { path: '**', redirectTo: 'signup' },
];
