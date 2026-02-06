export interface BookingData {
  name: string;
  email: string;
  phone: string;
  description: string;
  date: string; // "yyyy-MM-dd"
  time: string; // "HH:mm"
  serviceTitle: string;
  servicePrice: number;
  addons?: {
    id: string;
    label: string;
    price: number;
  }[];
  totalPrice: number;
}
