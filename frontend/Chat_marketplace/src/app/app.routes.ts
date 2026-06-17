import { Routes } from '@angular/router';
import { MarketplacePage } from './features/marketplace/pages/marketplace-page/marketplace-page';

export const routes: Routes = [
    {
        path: 'auth-page',
        loadComponent: ()=>
            import('./features/auth/pages/auth-page/auth-page')
        .then(m => m.AuthPage)
    },
    {
        path: 'chat-contacts',
        loadComponent:() =>
            import('./features/chat/pages/contacts/contacts-page')
        .then(m => m.ContactsPage)
    },
    {
        path: 'chat-view',
        loadComponent: () =>
            import('./features/chat/pages/chat-view-page/chat-view-page')
            .then(m => m.ChatViewPage)
    },
    {
        path: 'add-contact',
        loadComponent: () =>
            import('./features/chat/pages/add-contact-page/add-contact-page')
            .then(m => m.AddContactPage)
    },
    {
        path: 'marketplace',
        component: MarketplacePage
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
