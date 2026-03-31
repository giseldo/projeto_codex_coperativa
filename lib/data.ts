import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import { Order, Product, WeeklyProductSummary } from "@/lib/types";

export const getActiveProducts = cache(async (): Promise<Product[]> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("name");

  if (error) return [];
  return (data ?? []) as Product[];
});

export async function getAdminProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as Product[];
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .single();

  return (data as Order | null) ?? null;
}

export async function getCustomerOrders(userId: string): Promise<Order[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data as Order[] | null) ?? [];
}

export async function getAdminOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  return (data as Order[] | null) ?? [];
}

export async function getWeeklyReport(startDate: string, endDate: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("id, total_amount, status, created_at, order_items(*)")
    .gte("created_at", `${startDate}T00:00:00`)
    .lte("created_at", `${endDate}T23:59:59`)
    .neq("status", "cancelled");

  const orders = (data as Order[] | null) ?? [];
  const summaryMap = new Map<string, WeeklyProductSummary>();

  for (const order of orders) {
    for (const item of order.order_items ?? []) {
      const key = `${item.product_name}-${item.unit}`;
      const current = summaryMap.get(key);
      if (current) {
        current.total_quantity += item.quantity;
        current.total_revenue += item.line_total;
      } else {
        summaryMap.set(key, {
          product_name: item.product_name,
          unit: item.unit,
          total_quantity: item.quantity,
          total_revenue: item.line_total
        });
      }
    }
  }

  return {
    orders,
    summary: Array.from(summaryMap.values()).sort((a, b) =>
      a.product_name.localeCompare(b.product_name, "pt-BR")
    ),
    totalRevenue: orders.reduce((sum, order) => sum + order.total_amount, 0)
  };
}
