import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-admin.component.html',
  styleUrl: './usuarios-admin.component.css'
})
export class UsuariosAdminComponent implements OnInit {
  usuarios: Usuario[] = [];
  isLoading = true;
  showAddForm = false;
  editingUser: Usuario | null = null;

  newUser = {
    nombre: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    telefono: '',
    direccion: '',
    fecha_nacimiento: ''
  };

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    await this.loadUsuarios();
  }

  async loadUsuarios(): Promise<void> {
    try {
      this.usuarios = await this.apiService.getUsuarios().toPromise() || [];
    } catch (error) {
      console.error('Error loading usuarios:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async addUser(): Promise<void> {
    try {
      await this.apiService.createUsuario(this.newUser).toPromise();
      await this.loadUsuarios();
      this.showAddForm = false;
      this.resetForm();
      alert('Usuario creado correctamente');
    } catch (error) {
      alert('Error al crear usuario');
    }
  }

  async updateUser(): Promise<void> {
    if (!this.editingUser) return;

    try {
      await this.apiService.updateUsuario(this.editingUser.id!, this.editingUser).toPromise();
      await this.loadUsuarios();
      this.editingUser = null;
      alert('Usuario actualizado correctamente');
    } catch (error) {
      alert('Error al actualizar usuario');
    }
  }

  async deleteUser(id: number): Promise<void> {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await this.apiService.deleteUsuario(id).toPromise();
        await this.loadUsuarios();
        alert('Usuario eliminado correctamente');
      } catch (error) {
        alert('Error al eliminar usuario');
      }
    }
  }

  editUser(usuario: Usuario): void {
    this.editingUser = { ...usuario };
  }

  cancelEdit(): void {
    this.editingUser = null;
  }

  resetForm(): void {
    this.newUser = {
      nombre: '',
      email: '',
      password: '',
      role: 'user',
      telefono: '',
      direccion: '',
      fecha_nacimiento: ''
    };
  }
}
