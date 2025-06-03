import { Routes } from '@angular/router';
import { HomePage } from './home-page/home-page';
import { Login } from './login/login';

export const routes: Routes = [
  { path: '', component: Login },         // Login es la ruta principal
  { path: 'home', component: HomePage },  // Home accesible luego del login
  { path: '**', redirectTo: '' }          // Redirección para rutas no válidas (opcional)
];

