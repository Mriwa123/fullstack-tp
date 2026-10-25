import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="flex flex-col rounded-lg border p-4 shadow-sm hover:shadow-md"
    >
      <Image
        src={product.thumbnail}
        alt={product.title}
        width={300}
        height={300}
        loading="eager"
        className="mx-auto h-48 w-auto object-contain"
      />
      <h2 className="mt-2 font-bold">{product.title}</h2>
      <p className="text-green-600">${Number(product.price)}</p>
      <p className="line-clamp-2 text-sm text-gray-600">{product.description}</p>
    </Link>
  );
}