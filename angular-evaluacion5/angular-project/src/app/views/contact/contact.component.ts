import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  isLoading = false;

  constructor(private apiService: ApiService) {}

  async onSubmit(): Promise<void> {
    this.isLoading = true;
    try {
      await this.apiService.sendContactMessage(this.contactForm).toPromise();
      alert('Mensaje enviado correctamente');
      this.contactForm = { name: '', email: '', subject: '', message: '' };
    } catch (error) {
      alert('Error al enviar el mensaje');
    } finally {
      this.isLoading = false;
    }
  }
}
