import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminProductForm } from "@/components/admin-product-form";
import { requireRole } from "@/lib/auth";
import { getAdminProducts } from "@/lib/data";

export default async function EditProductPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("admin");
  const { id } = await params;
  const products = await getAdminProducts();
  const product = products.find((item) => item.id === id);
  if (!product) notFound();

  return (
    <div className="grid">
      <div className="button-row">
        <Link href="/admin/produtos" className="pill-link">
          Voltar
        </Link>
      </div>
      <div className="admin-products-layout admin-products-layout--single">
        <AdminProductForm product={product} />
      </div>
    </div>
  );
}
