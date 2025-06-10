import { Injectable, computed, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Theme {
  // Señal para la paleta activa
  private activePalette = signal<any>(null);
  
  // Computed para los estilos CSS
  cssVariables = computed(() => {
    const palette = this.activePalette();
    if (!palette) return {};
    
    return {
      '--color-primary': palette.color_primario,
      '--color-secondary': palette.color_secundario,
      '--color-tertiary': palette.color_terciario,
      '--color-text': palette.color_texto,
      '--color-background': palette.color_fondo
    };
  });

  constructor() {
    // Efecto para aplicar los estilos cuando cambia la paleta
    effect(() => {
      const variables = this.cssVariables();
      this.applyStylesToDocument(variables);
    });
  }


  // Establecer la paleta activa
  setActivePalette(palette: any) {
    this.activePalette.set(palette);
    this.applyStylesToDocument(palette);
  }

  // Obtener la paleta activa
  getActivePalette() {
    return this.activePalette();
  }

  // Aplicar estilos al documento
  private applyStylesToDocument(variables: any): void {
    const root = document.documentElement;
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value as string);
    });
  }
}