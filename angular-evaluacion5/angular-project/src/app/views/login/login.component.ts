import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async handleLogin(event: Event): Promise<void> {
    event.preventDefault();
    this.isLoading = true;

    try {
      const response = await this.authService.login({ email: this.email, password: this.password }).toPromise();
      this.router.navigate(['/']);
    } catch (error: any) {
      alert(error.error?.message || 'Error al iniciar sesión');
    } finally {
      this.isLoading = false;
    }
  }
}
