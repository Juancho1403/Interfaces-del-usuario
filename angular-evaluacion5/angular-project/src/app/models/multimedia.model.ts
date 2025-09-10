export interface Imagen {
  id?: number;
  nombre: string;
  url: string;
  tipo: string;
  tamaño: number;
  created_at?: string;
  updated_at?: string;
}

export interface Video {
  id?: number;
  nombre: string;
  url: string;
  tipo: string;
  tamaño: number;
  duracion?: number;
  subtitulos?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CarouselItem {
  id: number;
  src: string;
  name: string;
  info?: any;
  isDefault: boolean;
}

export interface CarouselVideo extends CarouselItem {
  subtitles?: string[];
}
