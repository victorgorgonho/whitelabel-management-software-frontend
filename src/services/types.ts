export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  registration: string;
  user_type: string;
  whatsapp: string;
}

export interface IGBEUFResponse {
  sigla: string;
}

export interface IBGECityResponse {
  nome: string;
}

export interface Options {
  name: string;
  value: string;
}

export interface Payment {
  id: number;
  amount?: number;
  date: string;
  isPaid: boolean;
  payment_type: string;
  receipt_url: string | undefined;
  user_id: number;
  updatedAt: string;
}

export interface infoStudent {
  name: string;
  title: string;
  value: number;
}
