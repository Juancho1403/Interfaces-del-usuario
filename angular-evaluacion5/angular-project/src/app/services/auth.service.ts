import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Usuario, LoginCredentials, RegisterData, AuthResponse } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          this.currentUserSubject.next(user);
        } catch (error) {
          this.logout();
        }
      }
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return new Observable(observer => {
      this.apiService.login(credentials).subscribe({
        next: (response: AuthResponse) => {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.user.role);
            localStorage.setItem('userId', response.user.id?.toString() || '');
            localStorage.setItem('user', JSON.stringify(response.user));
          }
          
          this.currentUserSubject.next(response.user);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  register(userData: RegisterData): Observable<AuthResponse> {
    return new Observable(observer => {
      this.apiService.register(userData).subscribe({
        next: (response: AuthResponse) => {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.user.role);
            localStorage.setItem('userId', response.user.id?.toString() || '');
            localStorage.setItem('user', JSON.stringify(response.user));
          }
          
          this.currentUserSubject.next(response.user);
          observer.next(response);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('userId');
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  isAdmin(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('role') === 'admin';
    }
    return false;
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  getUserId(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('userId');
    }
    return null;
  }
}
