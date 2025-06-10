import { Component, AfterViewInit } from '@angular/core';
import { ColorsService } from '../services/colors.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-form-full',
    imports: [ReactiveFormsModule],
    templateUrl: './form-full.html',
    styleUrls: ['./form-full.css']
})
export class FormFull implements AfterViewInit {

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

    ngAfterViewInit(): void {
        // Cambio de módulos
        const tabBtns = document.querySelectorAll('.tab-btn');
        const moduleContents = document.querySelectorAll('.module-content');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function(this: HTMLElement) {
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                moduleContents.forEach(content => content.classList.remove('active'));
                const tabId = this.getAttribute('data-tab');
                const tabContent = document.getElementById(tabId!);
                if (tabContent) tabContent.classList.add('active');
            });
        });

        // Controladores de inputs de color
        const colorPrimary = document.getElementById('colorPrimary') as HTMLInputElement;
        const colorSecondary = document.getElementById('colorSecondary') as HTMLInputElement;
        const colorAccent = document.getElementById('colorAccent') as HTMLInputElement;
        const colorText = document.getElementById('colorText') as HTMLInputElement;
        const colorBackground = document.getElementById('colorBackground') as HTMLInputElement;

        colorPrimary?.addEventListener('input', function(this: HTMLInputElement) {
            document.documentElement.style.setProperty('--color-primary', this.value);
        });
        colorSecondary?.addEventListener('input', function(this: HTMLInputElement) {
            document.documentElement.style.setProperty('--color-secondary', this.value);
        });
        colorAccent?.addEventListener('input', function(this: HTMLInputElement) {
            document.documentElement.style.setProperty('--color-accent', this.value);
        });
        colorText?.addEventListener('input', function(this: HTMLInputElement) {
            document.documentElement.style.setProperty('--color-text', this.value);
        });
        colorBackground?.addEventListener('input', function(this: HTMLInputElement) {
            document.documentElement.style.setProperty('--color-background', this.value);
        });

        // Controladores de tamaño de fuente
        const titleSize = document.getElementById('titleSize') as HTMLInputElement;
        const subtitleSize = document.getElementById('subtitleSize') as HTMLInputElement;
        const paragraphSize = document.getElementById('paragraphSize') as HTMLInputElement;

        titleSize?.addEventListener('input', function(this: HTMLInputElement) {
            document.documentElement.style.setProperty('--font-size-title', this.value + 'px');
            const el = document.getElementById('previewTitleSize');
            if (el) el.textContent = this.value + 'px';
        });
        subtitleSize?.addEventListener('input', function(this: HTMLInputElement) {
            document.documentElement.style.setProperty('--font-size-subtitle', this.value + 'px');
            const el = document.getElementById('previewSubtitleSize');
            if (el) el.textContent = this.value + 'px';
        });
        paragraphSize?.addEventListener('input', function(this: HTMLInputElement) {
            document.documentElement.style.setProperty('--font-size-paragraph', this.value + 'px');
            const el = document.getElementById('previewParagraphSize');
            if (el) el.textContent = this.value + 'px';
        });

        // Controladores de archivos de fuentes
        const fontFiles = document.querySelectorAll('input[type="file"]');
        fontFiles.forEach(fileInput => {
            fileInput.addEventListener('change', function(this: HTMLInputElement) {
                const fileLabel = this.previousElementSibling as HTMLElement;
                if (this.files && this.files.length > 0) {
                    fileLabel.textContent = this.files[0].name;
                    fileLabel.style.backgroundColor = '#d4edda';
                    fileLabel.style.color = '#155724';
                } else {
                    fileLabel.textContent = 'Seleccionar archivo .ttf';
                    fileLabel.style.backgroundColor = '';
                    fileLabel.style.color = '';
                }
            });
        });

        // Botón Guardar
        const saveBtn = document.querySelector('.save-btn') as HTMLButtonElement;
        saveBtn?.addEventListener('click', function(this: HTMLButtonElement) {
            const btn = this;
            btn.textContent = 'Guardando...';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = '¡Cambios guardados!';
                btn.style.backgroundColor = '#28a745';
                setTimeout(() => {
                    btn.textContent = 'Guardar Cambios';
                    btn.style.backgroundColor = '#20c997';
                    btn.disabled = false;
                }, 2000);
            }, 1000);
        });
    }
}
