import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: Usuario | null = null;
  isEditing = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  async saveProfile(): Promise<void> {
    if (!this.user) return;

    this.isLoading = true;
    try {
      await this.apiService.updateUsuario(this.user.id!, this.user).toPromise();
      this.isEditing = false;
      alert('Perfil actualizado correctamente');
    } catch (error) {
      alert('Error al actualizar el perfil');
    } finally {
      this.isLoading = false;
    }
  }
}
