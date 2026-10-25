import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { CategoryWithCount, ProductsResponse } from "@/types/product";

const LIMIT = 12;
const API = process.env.API_URL;

export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const { q = "", category = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const skip = (page - 1) * LIMIT;

  const params = new URLSearchParams({ limit: String(LIMIT), skip: String(skip) });
  if (q) params.set("q", q);
  if (category) params.set("category", category);

  const [productsRes, categoriesRes] = await Promise.all([
    fetch(`${API}/products?${params}`, { cache: "no-store" }),
    fetch(`${API}/categories`, { cache: "no-store" }),
  ]);

  if (!productsRes.ok) {
    return <p className="p-4">Unable to load the products</p>;
  }
  const data: ProductsResponse = await productsRes.json();
  const categories: CategoryWithCount[] = categoriesRes.ok
    ? await categoriesRes.json()
    : [];

  const totalPages = Math.max(1, Math.ceil(data.total / LIMIT));

  const pageHref = (p: number) => {
    const s = new URLSearchParams();
    if (q) s.set("q", q);
    if (category) s.set("category", category);
    s.set("page", String(p));
    return `/products?${s}`;
  };

  return (
    <div className="p-4">
      <form action="/products" className="mb-6 flex flex-wrap gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search products..."
          className="rounded border px-3 py-2"
        />
        <select
          name="category"
          defaultValue={category}
          className="rounded border px-3 py-2"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name} ({c._count.products})
            </option>
          ))}
        </select>
        <button type="submit" className="rounded border px-4 py-2">
          Search
        </button>
        {(q || category) && (
          <Link href="/products" className="rounded border px-4 py-2">
            Reset
          </Link>
        )}
      </form>

      <p className="mb-4 text-sm text-gray-600">{data.total} product(s)</p>

      {data.products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {data.products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-4">
        {page > 1 && (
          <Link className="rounded border px-4 py-2" href={pageHref(page - 1)}>
            Previous
          </Link>
        )}
        <span>
          Page {page} / {totalPages}
        </span>
        {page < totalPages && (
          <Link className="rounded border px-4 py-2" href={pageHref(page + 1)}>
            Next
          </Link>
        )}
      </div>
    </div>
  );
}