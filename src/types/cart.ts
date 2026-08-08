export type DeliveryMode = "domicilio" | "recogida";

export interface CartItem {
  id: string;
  productId: string;
  slug: string;
  title: string;
  finish?: string;
  image?: string;
  quantity: number;
  notes?: string;
}

export interface ContactInfo {
  name: string;
  taxId: string;
  email: string;
  phone: string;
  address?: string;
  postalCode?: string;
  city?: string;
  province?: string;
}
