export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
}

export interface AuthResponse {
  token: string;
  user: Usuario;
}
