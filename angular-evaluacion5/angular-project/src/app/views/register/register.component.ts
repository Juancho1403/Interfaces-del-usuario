import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  nombre = '';
  telefono = '';
  direccion = '';
  fechaNacimiento = '';
  isLoading = false;
  errors: any = {};

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  validateForm(): boolean {
    this.errors = {};
    
    // Validar email
    if (!this.email) {
      this.errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.errors.email = 'El email no es válido';
    }
    
    // Validar contraseña
    if (!this.password) {
      this.errors.password = 'La contraseña es requerida';
    } else if (this.password.length < 6) {
      this.errors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    // Validar confirmación de contraseña
    if (!this.confirmPassword) {
      this.errors.confirmPassword = 'La confirmación de contraseña es requerida';
    } else if (this.password !== this.confirmPassword) {
      this.errors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validar nombre
    if (!this.nombre) {
      this.errors.nombre = 'El nombre es requerido';
    }

    return Object.keys(this.errors).length === 0;
  }

  async handleRegister(event: Event): Promise<void> {
    event.preventDefault();
    
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    try {
      await this.authService.register({
        nombre: this.nombre,
        email: this.email,
        password: this.password,
        telefono: this.telefono,
        direccion: this.direccion,
        fecha_nacimiento: this.fechaNacimiento
      }).toPromise();
      
      alert('Registro exitoso. Ahora puedes iniciar sesión.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      alert(error.error?.message || 'Error en el registro');
    } finally {
      this.isLoading = false;
    }
  }
}
