export type UserRole = "customer" | "admin";

export type Product = {
  id: string;
  name: string;
  description: string | null;
  category?: string | null;
  price: number;
  unit: string;
  image_path?: string | null;
  image_url?: string | null;
  active: boolean;
  created_at: string;
};

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
};

export type Profile = {
  id: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
};

export type OrderStatus = "pending" | "paid" | "cancelled";

export type Order = {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  notes: string | null;
  total_amount: number;
  status: OrderStatus;
  payment_proof_path: string | null;
  payment_proof_url?: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  unit: string;
  quantity: number;
  unit_price: number;
  line_total: number;
};

export type WeeklyProductSummary = {
  product_name: string;
  unit: string;
  total_quantity: number;
  total_revenue: number;
};
