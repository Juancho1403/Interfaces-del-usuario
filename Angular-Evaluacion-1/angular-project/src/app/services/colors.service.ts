import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorsService {
  private apiUrl = 'http://localhost:3001/api/colores';

  constructor(private http: HttpClient) { }

  // Obtener todas las paletas
  getColors(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Obtener una paleta por ID
  getColor(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva paleta
  createColor(colorData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, colorData);
  }

  // Actualizar una paleta existente
  updateColor(id: number, colorData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, colorData);
  }

  // Eliminar una paleta
  deleteColor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}