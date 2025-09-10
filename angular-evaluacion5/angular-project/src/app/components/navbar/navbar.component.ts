import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() isLoggedIn: boolean = false;
  @Output() logout = new EventEmitter<void>();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get role(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('role');
    }
    return null;
  }

  handleLogout(): void {
    this.authService.logout();
    this.logout.emit();
    this.router.navigate(['/']);
  }
}
