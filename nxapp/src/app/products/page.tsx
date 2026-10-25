import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { ProductsResponse } from "@/types/product";

const LIMIT = 12;

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ skip?: string }>;
}) {
  const { skip: skipParam } = await searchParams;
  const skip = Math.max(0, Number(skipParam) || 0);

  const response = await fetch(
    `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`
  );
  if (!response.ok) {
    return <p className="p-4">Unable to load the products</p>;
  }
  const data: ProductsResponse = await response.json();

  const hasPrev = skip > 0;
  const hasNext = skip + LIMIT < data.total;

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data.products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-4">
        {hasPrev && (
          <Link
            className="rounded border px-4 py-2"
            href={`/products?skip=${Math.max(0, skip - LIMIT)}`}
          >
            Previous
          </Link>
        )}
        {hasNext && (
          <Link
            className="rounded border px-4 py-2"
            href={`/products?skip=${skip + LIMIT}`}
          >
            Next
          </Link>
        )}
      </div>
    </div>
  );
}