import { Component, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-form-full',
    templateUrl: './form-full.html',
    styleUrls: ['./form-full.css']
})
export class FormFull implements AfterViewInit {

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
