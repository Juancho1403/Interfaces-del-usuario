import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './complete-profile.component.html',
  styleUrl: './complete-profile.component.css'
})
export class CompleteProfileComponent {
  profileData = {
    telefono: '',
    direccion: '',
    fecha_nacimiento: ''
  };
  isLoading = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  async completeProfile(): Promise<void> {
    this.isLoading = true;
    try {
      const userId = this.authService.getUserId();
      if (userId) {
        await this.apiService.updateUsuario(parseInt(userId), this.profileData).toPromise();
        alert('Perfil completado correctamente');
        this.router.navigate(['/profile']);
      }
    } catch (error) {
      alert('Error al completar el perfil');
    } finally {
      this.isLoading = false;
    }
  }
}
