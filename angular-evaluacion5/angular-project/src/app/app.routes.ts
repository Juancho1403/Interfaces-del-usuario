import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./views/home/home.component').then(m => m.HomeComponent) },
  { path: 'login', loadComponent: () => import('./views/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./views/register/register.component').then(m => m.RegisterComponent) },
  { 
    path: 'completar-perfil', 
    loadComponent: () => import('./views/complete-profile/complete-profile.component').then(m => m.CompleteProfileComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'perfil', 
    loadComponent: () => import('./views/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'configuraciones', 
    loadComponent: () => import('./views/configuraciones/configuraciones.component').then(m => m.ConfiguracionesComponent),
    canActivate: [AdminGuard]
  },
  { 
    path: 'usuarios-admin', 
    loadComponent: () => import('./views/usuarios-admin/usuarios-admin.component').then(m => m.UsuariosAdminComponent),
    canActivate: [AdminGuard]
  },
  { 
    path: 'usuarios', 
    loadComponent: () => import('./views/usuarios/usuarios.component').then(m => m.UsuariosComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'multimedia', 
    loadComponent: () => import('./views/multimedia-admin/multimedia-admin.component').then(m => m.MultimediaAdminComponent),
    canActivate: [AdminGuard]
  },
  { path: 'service', loadComponent: () => import('./views/service/service.component').then(m => m.ServiceComponent) },
  { path: 'single', loadComponent: () => import('./views/single/single.component').then(m => m.SingleComponent) },
  { path: 'testimonial', loadComponent: () => import('./views/testimonial/testimonial.component').then(m => m.TestimonialComponent) },
  { path: 'destination', loadComponent: () => import('./views/destination/destination.component').then(m => m.DestinationComponent) },
  { path: 'guide', loadComponent: () => import('./views/guide/guide.component').then(m => m.GuideComponent) },
  { path: 'package', loadComponent: () => import('./views/package/package.component').then(m => m.PackageComponent) },
  { path: 'blog', loadComponent: () => import('./views/blog/blog.component').then(m => m.BlogComponent) },
  { path: 'about', loadComponent: () => import('./views/about/about.component').then(m => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./views/contact/contact.component').then(m => m.ContactComponent) },
  { path: '**', redirectTo: '/home' }
];
