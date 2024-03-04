import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { isUserLoggedGuard } from './guards/is-user-logged.can-activate.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginPageComponent
    },
    {
        path: 'register',
        component: RegisterPageComponent
    },
    {
        path: 'task',
        loadComponent: () => import('./pages/task-pages/task-pages.component'),
        canActivate: [ isUserLoggedGuard ]
    },
    {
        path: 'perfil',
        loadComponent: () => import('./pages/perfil-page/perfil-page.component'),
        canActivate: [ isUserLoggedGuard ]
    }
];
