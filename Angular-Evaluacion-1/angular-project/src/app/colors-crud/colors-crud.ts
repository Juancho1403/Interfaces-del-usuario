import { Component, OnInit } from '@angular/core';
import { ColorsService } from '../services/colors.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-colors-crud',
  imports: [ReactiveFormsModule],
  templateUrl: './colors-crud.html',
  styleUrl: './colors-crud.css'
})
export class ColorsCrud  implements OnInit{
  colors: any[] = [];
  colorForm: FormGroup;
  selectedColor: any = null;
  isEditing = false;
  isLoading = true;
  errorMessage = '';

  constructor(
    private colorsService: ColorsService,
    private fb: FormBuilder
  ) {
    this.colorForm = this.fb.group({
      nombre_paleta: ['', Validators.required],
      color_primario: ['#ffffff', Validators.required],
      color_secundario: ['#ffffff', Validators.required],
      color_terciario: ['#ffffff', Validators.required],
      color_texto: ['#000000', Validators.required],
      color_fondo: ['#ffffff', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadColors();
  }

  loadColors(): void {
    this.isLoading = true;
    this.colorsService.getColors().subscribe({
      next: (data) => {
        this.colors = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading colors:', err);
        this.errorMessage = 'Error al cargar las paletas de colores';
        this.isLoading = false;
      }
    });
  }

  initForm(): void {
    this.colorForm.reset({
      nombre_paleta: '',
      color_primario: '#ffffff',
      color_secundario: '#ffffff',
      color_terciario: '#ffffff',
      color_texto: '#000000',
      color_fondo: '#ffffff'
    });
    this.selectedColor = null;
    this.isEditing = false;
  }

  selectColor(color: any): void {
    this.selectedColor = color;
    this.colorForm.patchValue({
      nombre_paleta: color.nombre_paleta,
      color_primario: color.color_primario,
      color_secundario: color.color_secundario,
      color_terciario: color.color_terciario,
      color_texto: color.color_texto,
      color_fondo: color.color_fondo
    });
    this.isEditing = true;
  }

  onSubmit(): void {
    if (this.colorForm.invalid) {
      this.errorMessage = 'Por favor, completa todos los campos requeridos';
      return;
    }

    const colorData = this.colorForm.value;

    if (this.isEditing && this.selectedColor) {
      this.updateColor(this.selectedColor.id, colorData);
    } else {
      this.createColor(colorData);
    }
  }

  createColor(colorData: any): void {
    this.colorsService.createColor(colorData).subscribe({
      next: () => {
        this.loadColors();
        this.initForm();
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error creating color:', err);
        this.errorMessage = 'Error al crear la paleta de colores';
      }
    });
  }

  updateColor(id: number, colorData: any): void {
    this.colorsService.updateColor(id, colorData).subscribe({
      next: () => {
        this.loadColors();
        this.initForm();
        this.errorMessage = '';
      },
      error: (err) => {
        console.error('Error updating color:', err);
        this.errorMessage = 'Error al actualizar la paleta de colores';
      }
    });
  }

  deleteColor(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta paleta de colores?')) {
      this.colorsService.deleteColor(id).subscribe({
        next: () => {
          this.loadColors();
          if (this.selectedColor && this.selectedColor.id === id) {
            this.initForm();
          }
        },
        error: (err) => {
          console.error('Error deleting color:', err);
          this.errorMessage = 'Error al eliminar la paleta de colores';
        }
      });
    }
  }
}
