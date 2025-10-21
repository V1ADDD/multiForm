import { Routes } from '@angular/router';
import { SignUp } from './components/sign-up/sign-up';
import { StepBasic } from './components/step-basic/step-basic';

export const routes: Routes = [
    { path: '', redirectTo:'/signup', pathMatch: 'full'},
    { //method -> basic -> additional -> rules
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
            }
    ] },
    // { path: 'additional', component: Additional },
    // { path: 'rules', component: Rules }
];
