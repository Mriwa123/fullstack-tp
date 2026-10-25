import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await fetch(`${process.env.API_URL}/products/${id}`, {
    cache: "no-store",
  });
  if (!response.ok) {
    return <p className="p-4">Product not found</p>;
  }
  const product: Product = await response.json();

  return (
    <div className="p-4">
      <Link href="/products" className="text-blue-600 underline">
        ← Back to catalogue
      </Link>
      <div className="mt-4 flex flex-col gap-6 md:flex-row">
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={400}
          height={400}
          className="rounded border"
        />
        <div>
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p className="text-green-600">${Number(product.price)}</p>
          <p className="text-sm text-gray-500">
            {product.category.name} · stock: {product.stock}
          </p>
          <p className="mt-4">{product.description}</p>
        </div>
      </div>
    </div>
  );
}