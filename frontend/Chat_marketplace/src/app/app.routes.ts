import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { MarketplacePage } from './features/marketplace/pages/marketplace-page/marketplace-page';
import { noAuthGuardGuard } from './core/guards/no-auth-guard-guard';
import { ProfilePage } from './features/perfil/pages/profile-page/profile-page';


export const routes: Routes = [
    {
        path: 'auth-page',
        canActivate: [noAuthGuardGuard],
        loadComponent: ()=>
            import('./features/auth/pages/auth-page/auth-page')
        .then(m => m.AuthPage)
    },
    {
        path: 'chat-contacts',
        canActivate:[authGuard],
        loadComponent:() =>
            import('./features/chat/pages/contacts/contacts-page')
        .then(m => m.ContactsPage)
    },
    {
        path: 'chat-view',
        canActivate:[authGuard],
        loadComponent: () =>
            import('./features/chat/pages/chat-view-page/chat-view-page')
            .then(m => m.ChatViewPage)
    },
    {
        path: 'add-contact',
        canActivate:[authGuard],
        loadComponent: () =>
            import('./features/chat/pages/add-contact-page/add-contact-page')
            .then(m => m.AddContactPage)
    },
    {
        path: 'profile',
        canActivate:[authGuard],
        loadComponent: () =>
            import('./features/perfil/pages/profile-page/profile-page')
        .then(m => m.ProfilePage)
    },
    {
        path: 'marketplace',
        canActivate:[authGuard],
        component: MarketplacePage
    },
    {
        path: 'create-post',
        canActivate:[authGuard],
        loadComponent:() =>
            import('./features/marketplace/pages/create-post/create-post')
        .then(m => m.CreatePost)
    },
    {
        path: 'favoritos',
        canActivate: [authGuard],
        loadComponent: ()=>
            import('./features/marketplace/pages/favoritos-page/favoritos-page')
        .then(m=>m.FavoritosPage)
    },
    {
    path: 'product-detail/:id',
    loadComponent: () =>
        import('./features/marketplace/pages/product-detail-page/product-detail-page')
        .then(m => m.ProductDetailPage),
    canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: 'chat-contacts',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'chat-contacts'
    }
];
