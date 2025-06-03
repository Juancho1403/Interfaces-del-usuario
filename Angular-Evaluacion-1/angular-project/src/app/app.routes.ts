import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Login } from './login/login';
import { FormFull } from './form-full/form-full';

export const routes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomePage},
    {path: 'login', component: Login},
    {path: 'form', component: FormFull},
];
