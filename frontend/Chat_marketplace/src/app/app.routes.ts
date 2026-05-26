import { Routes } from '@angular/router';
import { AuthPage } from './features/auth/pages/auth-page/auth-page';

export const routes: Routes = [
    {
        path: 'auth-page',
        component:AuthPage 
    },
    {
        path: '',
        redirectTo: 'auth-page',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'auth-page'
    }
];
