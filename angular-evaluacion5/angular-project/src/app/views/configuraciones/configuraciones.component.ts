import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Color } from '../../models/color.model';
import { TipografiaTamanio } from '../../models/tipografia.model';

@Component({
  selector: 'app-configuraciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuraciones.component.html',
  styleUrl: './configuraciones.component.css'
})
export class ConfiguracionesComponent implements OnInit {
  colores: Color[] = [];
  tipografias: TipografiaTamanio[] = [];
  isLoading = true;

  // Color configuration
  colorConfig = {
    color_primario: '#7AB730',
    color_secundario: '#5f8f25',
    color_terciario: '#89b70d',
    color_texto: '#212121',
    color_fondo: '#FFFFFF'
  };

  // Typography configuration
  typographyConfig = {
    fuente_titulo: 'Arial',
    fuente_texto: 'Arial',
    tam_titulo: 32,
    tam_subtitulo: 24,
    tam_texto: 16
  };

  constructor(private apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    await this.loadConfigurations();
  }

  async loadConfigurations(): Promise<void> {
    try {
      this.colores = await this.apiService.getColores().toPromise() || [];
      this.tipografias = await this.apiService.getTipografiaTamanio().toPromise() || [];
      
      // Load saved configurations
      if (typeof window !== 'undefined' && window.localStorage) {
        const savedColors = localStorage.getItem('coloresConfig');
        if (savedColors) {
          this.colorConfig = JSON.parse(savedColors);
        }

        const savedTypography = localStorage.getItem('tipografiaConfig');
        if (savedTypography) {
          this.typographyConfig = JSON.parse(savedTypography);
        }
      }
    } catch (error) {
      console.error('Error loading configurations:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async saveColorConfiguration(): Promise<void> {
    try {
      // Save to localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('coloresConfig', JSON.stringify(this.colorConfig));
      }
      
      // Apply to document
      document.documentElement.style.setProperty('--color-primary', this.colorConfig.color_primario);
      document.documentElement.style.setProperty('--color-secondary', this.colorConfig.color_secundario);
      document.documentElement.style.setProperty('--color-accent', this.colorConfig.color_terciario);
      document.documentElement.style.setProperty('--color-text', this.colorConfig.color_texto);
      document.documentElement.style.setProperty('--color-background', this.colorConfig.color_fondo);
      
      alert('Configuración de colores guardada');
    } catch (error) {
      alert('Error al guardar configuración de colores');
    }
  }

  async saveTypographyConfiguration(): Promise<void> {
    try {
      // Save to localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('tipografiaConfig', JSON.stringify(this.typographyConfig));
      }
      
      // Apply to document
      document.documentElement.style.setProperty('--font-heading', this.typographyConfig.fuente_titulo);
      document.documentElement.style.setProperty('--font-main', this.typographyConfig.fuente_texto);
      document.documentElement.style.setProperty('--font-size-title', `${this.typographyConfig.tam_titulo}px`);
      document.documentElement.style.setProperty('--font-size-subtitle', `${this.typographyConfig.tam_subtitulo}px`);
      document.documentElement.style.setProperty('--font-size-paragraph', `${this.typographyConfig.tam_texto}px`);
      
      alert('Configuración de tipografía guardada');
    } catch (error) {
      alert('Error al guardar configuración de tipografía');
    }
  }
}
