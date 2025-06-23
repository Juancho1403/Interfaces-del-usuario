import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Login } from './login/login';
import { FormFull } from './form-full/form-full';
import { ColorsCrud } from './colors-crud/colors-crud';

export const routes: Routes = [
    {path: 'home', component: HomePage},
    {path: 'login', component: Login},
    {path: 'form', component: FormFull},
    {path: 'colors', component: ColorsCrud },
];
