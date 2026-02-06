// types/BookingData.ts

export interface BookingData {
  // Customer info
  customer: {
    name: string;
    email: string;
    phone: string;
    description?: string; // optional
  };

  // Booking date and time
  date: string; // format: "yyyy-MM-dd"
  time: string; // format: "HH:mm"

  // Service info
  service: {
    slug: string;
    title: string;
    price: number;
  };

  // Optional add-ons
  addons?: Array<{
    id: string;
    label: string;
    price: number;
  }>;

  // Total price = service price + addons total
  totalPrice: number;
}
