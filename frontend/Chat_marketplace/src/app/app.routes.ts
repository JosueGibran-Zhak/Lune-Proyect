import { Routes } from '@angular/router';
import { AuthPage } from './features/auth/pages/auth-page/auth-page';
import { MarketplacePage } from './features/marketplace/pages/marketplace-page/marketplace-page';
import { ContactsPage } from './features/chat/pages/contacts/contacts-page';
import { ChatViewPage } from './features/chat/pages/chat-view-page/chat-view-page';

export const routes: Routes = [
    {
        path: 'auth-page',
        component:AuthPage 
    },
    {
        path: 'chat-contacts',
        component: ContactsPage
    },
    {
        path: 'chat-view',
        component: ChatViewPage
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
