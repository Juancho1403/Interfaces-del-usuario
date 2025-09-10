import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { CarouselService } from './services/carousel.service';
import { filter } from 'rxjs/operators';
import { TopbarComponent } from './components/topbar/topbar.component';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, TopbarComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Travel Website');
  showSplash = signal(true);
  shouldHideHeader = signal(false);
  isLoggedIn = signal(false);

  private hideHeaderRoutes = ['/usuarios', '/configuraciones', '/usuarios-admin'];

  constructor(
    private router: Router,
    private authService: AuthService,
    private carouselService: CarouselService
  ) {}

  ngOnInit(): void {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      // Check if splash has been shown
      const splashShown = localStorage.getItem('splashShown');
      if (splashShown === 'true') {
        this.showSplash.set(false);
      } else {
        // Show splash for 15 seconds
        setTimeout(() => {
          localStorage.setItem('splashShown', 'true');
          this.showSplash.set(false);
        }, 15000);
      }
    } else {
      // Don't show splash on server side
      this.showSplash.set(false);
    }

    // Apply saved color configuration
    this.applyColorConfiguration();
    
    // Apply saved typography configuration
    this.applyTypographyConfiguration();

    // Subscribe to authentication state
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn.set(!!user);
    });

    // Subscribe to route changes to determine header visibility
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.shouldHideHeader.set(this.hideHeaderRoutes.includes(event.url));
      });
  }

  private applyColorConfiguration(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const coloresGuardados = localStorage.getItem('coloresConfig');
      if (coloresGuardados) {
        const paleta = JSON.parse(coloresGuardados);
        document.documentElement.style.setProperty('--color-primary', paleta.color_primario);
        document.documentElement.style.setProperty('--color-secondary', paleta.color_secundario);
        document.documentElement.style.setProperty('--color-accent', paleta.color_terciario);
        document.documentElement.style.setProperty('--color-text', paleta.color_texto);
        document.documentElement.style.setProperty('--color-background', paleta.color_fondo);
      } else {
        const coloresOriginales = {
          color_primario: '#7AB730',
          color_secundario: '#5f8f25',
          color_terciario: '#89b70d',
          color_texto: '#212121',
          color_fondo: '#FFFFFF',
        };
        Object.entries(coloresOriginales).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--${key.replace('_', '-')}`, value);
        });
      }
    }
  }

  private applyTypographyConfiguration(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const tipografiaGuardada = localStorage.getItem('tipografiaConfig');
      if (tipografiaGuardada) {
        const config = JSON.parse(tipografiaGuardada);
        document.documentElement.style.setProperty('--font-heading', config.fuente_titulo);
        document.documentElement.style.setProperty('--font-main', config.fuente_texto);
        document.documentElement.style.setProperty('--font-size-title', `${config.tam_titulo}px`);
        document.documentElement.style.setProperty('--font-size-subtitle', `${config.tam_subtitulo}px`);
        document.documentElement.style.setProperty('--font-size-paragraph', `${config.tam_texto}px`);
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
