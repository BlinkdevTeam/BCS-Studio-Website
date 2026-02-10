export interface BookingAddon {
  id: string;
  label: string;
  price: number;
}

export interface BookingData {
  customer: {
    name: string;
    email: string;
    phone: string;
    description?: string;
  };

  date: string; // yyyy-MM-dd
  time: string; // HH:mm

  service: {
    slug: string;
    title: string;
    price: number;
  };

  addons?: BookingAddon[];

  totalPrice: number;
}
