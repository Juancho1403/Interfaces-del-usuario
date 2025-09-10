import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  isLoading = true;

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.usuarios = await this.apiService.getUsuarios().toPromise() || [];
    } catch (error) {
      console.error('Error loading usuarios:', error);
    } finally {
      this.isLoading = false;
    }
  }
}
