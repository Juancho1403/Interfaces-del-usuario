import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuario, LoginCredentials, RegisterData, AuthResponse } from '../models/usuario.model';
import { Color } from '../models/color.model';
import { Tipografia, TamanioFuente, TipografiaTamanio } from '../models/tipografia.model';
import { Imagen, Video } from '../models/multimedia.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseURL = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    let token: string | null = null;
    if (typeof window !== 'undefined' && window.localStorage) {
      token = localStorage.getItem('token');
    }
    
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 401) {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userId');
      }
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return throwError(() => error);
  }

  // Usuario endpoints
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseURL}/usuarios`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createUsuario(usuarioData: RegisterData): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseURL}/usuarios`, usuarioData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateUsuario(id: number, usuarioData: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseURL}/usuarios/${id}`, usuarioData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/usuarios/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Authentication endpoints
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseURL}/usuarios/login`, credentials, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseURL}/usuarios/register`, userData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Colores endpoints
  getColores(): Observable<Color[]> {
    return this.http.get<Color[]>(`${this.baseURL}/colores`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createColor(colorData: Omit<Color, 'id'>): Observable<Color> {
    return this.http.post<Color>(`${this.baseURL}/colores`, colorData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateColor(id: number, colorData: Partial<Color>): Observable<Color> {
    return this.http.put<Color>(`${this.baseURL}/colores/${id}`, colorData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteColor(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/colores/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Tipografías endpoints
  getTipografias(): Observable<Tipografia[]> {
    return this.http.get<Tipografia[]>(`${this.baseURL}/tipografias`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getTamaniosFuente(): Observable<TamanioFuente[]> {
    return this.http.get<TamanioFuente[]>(`${this.baseURL}/tamanios-fuente`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getTipografiaTamanio(): Observable<TipografiaTamanio[]> {
    return this.http.get<TipografiaTamanio[]>(`${this.baseURL}/tipografia-tamanio`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createTipografiaTamanio(data: Omit<TipografiaTamanio, 'id'>): Observable<TipografiaTamanio> {
    return this.http.post<TipografiaTamanio>(`${this.baseURL}/tipografia-tamanio`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateTipografiaTamanio(id: number, data: Partial<TipografiaTamanio>): Observable<TipografiaTamanio> {
    return this.http.put<TipografiaTamanio>(`${this.baseURL}/tipografia-tamanio/${id}`, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteTipografiaTamanio(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/tipografia-tamanio/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Multimedia endpoints
  getImagenes(): Observable<Imagen[]> {
    return this.http.get<Imagen[]>(`${this.baseURL}/imagenes`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getVideos(): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.baseURL}/videos`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // About data (fallback)
  getAboutData(): Observable<any> {
    return this.http.get<any>(`${this.baseURL}/about`, { headers: this.getHeaders() })
      .pipe(catchError(() => {
        // Return default data if endpoint doesn't exist
        const defaultData = {
          title: "Sobre Nosotros",
          subtitle: "Descubre nuestra historia y misión",
          description: "Somos una empresa comprometida con la excelencia y la innovación.",
          features: [
            { title: "Experiencia", description: "Más de 10 años en el mercado" },
            { title: "Calidad", description: "Servicios de alta calidad garantizados" },
            { title: "Innovación", description: "Tecnología de vanguardia" }
          ]
        };
        return throwError(() => defaultData);
      }));
  }

  // Blog data (fallback)
  getBlogPosts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseURL}/blog`, { headers: this.getHeaders() })
      .pipe(catchError(() => {
        // Return default data if endpoint doesn't exist
        const defaultBlogData = [
          {
            id: 1,
            title: "Nuevas Tecnologías",
            excerpt: "Descubre las últimas tendencias en tecnología...",
            image: "/blog-1.jpg",
            date: "2024-01-15"
          },
          {
            id: 2,
            title: "Innovación Digital",
            excerpt: "Cómo la innovación está transformando...",
            image: "/blog-2.jpg",
            date: "2024-01-10"
          }
        ];
        return throwError(() => defaultBlogData);
      }));
  }

  // Contact endpoint
  sendContactMessage(messageData: any): Observable<any> {
    return this.http.post(`${this.baseURL}/contact`, messageData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}
