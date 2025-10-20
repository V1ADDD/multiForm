import { Routes } from '@angular/router';
import { SignUp } from './components/sign-up/sign-up';

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
            }
    ] },
    // { path: 'emailsignin', component: EmailSignIn },
    // { path: 'additional', component: Additional },
    // { path: 'rules', component: Rules }
];
