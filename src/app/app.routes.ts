import { Routes } from '@angular/router';
import { SignUp } from './components/sign-up/sign-up';

export const routes: Routes = [
    { path: '', redirectTo:'/signin', pathMatch: 'full'},
    { path: 'signin', component: SignUp },
    // { path: 'emailsignin', component: EmailSignIn },
    // { path: 'additional', component: Additional },
    // { path: 'rules', component: Rules }
];
