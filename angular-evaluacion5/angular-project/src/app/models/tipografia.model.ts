export interface Tipografia {
  id?: number;
  nombre: string;
  familia: string;
  created_at?: string;
  updated_at?: string;
}

export interface TamanioFuente {
  id?: number;
  nombre: string;
  tamanio: number;
  created_at?: string;
  updated_at?: string;
}

export interface TipografiaTamanio {
  id?: number;
  tipografia_id: number;
  tamanio_fuente_id: number;
  fuente_titulo: string;
  fuente_texto: string;
  tam_titulo: number;
  tam_subtitulo: number;
  tam_texto: number;
  created_at?: string;
  updated_at?: string;
}
