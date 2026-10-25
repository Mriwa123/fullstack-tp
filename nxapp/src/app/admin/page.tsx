"use client";

import { useCallback, useEffect, useState } from "react";
import type { Product, ProductsResponse } from "@/types/product";

const API = process.env.NEXT_PUBLIC_API_URL;
const LIMIT = 10;

type FormState = {
  title: string;
  description: string;
  price: string;
  thumbnail: string;
  stock: string;
  category: string;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  price: "",
  thumbnail: "",
  stock: "0",
  category: "",
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  const load = useCallback(async (p: number) => {
    const res = await fetch(
      `${API}/products?limit=${LIMIT}&skip=${(p - 1) * LIMIT}`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      setError("Unable to load the products");
      return;
    }
    const data: ProductsResponse = await res.json();
    setProducts(data.products);
    setTotal(data.total);
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  function update(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function cancel() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function edit(p: Product) {
    setEditingId(p.id);
    setMessage("");
    setError("");
    setForm({
      title: p.title,
      description: p.description,
      price: String(p.price),
      thumbnail: p.thumbnail,
      stock: String(p.stock),
      category: p.category.name,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    const body = {
      title: form.title,
      description: form.description,
      price: Number(form.price),
      thumbnail: form.thumbnail,
      stock: Number(form.stock),
      category: form.category,
    };

    const res = await fetch(
      editingId ? `${API}/products/${editingId}` : `${API}/products`,
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      setError(err?.details?.[0]?.message ?? err?.error ?? "Request failed");
      return;
    }

    setMessage(editingId ? "Product updated" : "Product created");
    cancel();
    load(page);
  }

  async function remove(p: Product) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    const res = await fetch(`${API}/products/${p.id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Delete failed");
      return;
    }
    setMessage("Product deleted");
    if (products.length === 1 && page > 1) setPage(page - 1);
    else load(page);
  }

  const input = "w-full rounded border px-3 py-2";

  return (
    <div className="mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Admin: products</h1>

      {message && (
        <p className="mb-3 rounded border border-green-300 bg-green-50 p-3 text-green-800">
          {message}
        </p>
      )}
      {error && (
        <p className="mb-3 rounded border border-red-300 bg-red-50 p-3 text-red-800">
          {error}
        </p>
      )}

      <form onSubmit={save} className="mb-8 grid gap-3 rounded-lg border p-4 sm:grid-cols-2">
        <h2 className="font-bold sm:col-span-2">
          {editingId ? `Edit product #${editingId}` : "New product"}
        </h2>
        <input
          className={input}
          placeholder="Title"
          required
          minLength={2}
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
        />
        <input
          className={input}
          placeholder="Category (created if missing)"
          required
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
        />
        <textarea
          className={`${input} sm:col-span-2`}
          placeholder="Description"
          required
          rows={2}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
        />
        <input
          className={`${input} sm:col-span-2`}
          type="url"
          placeholder="Thumbnail URL (https://...)"
          required
          value={form.thumbnail}
          onChange={(e) => update("thumbnail", e.target.value)}
        />
        <label className="text-sm">
          Price
          <input
            className={input}
            type="number"
            step="0.01"
            min="0.01"
            required
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
          />
        </label>
        <label className="text-sm">
          Stock
          <input
            className={input}
            type="number"
            min="0"
            required
            value={form.stock}
            onChange={(e) => update("stock", e.target.value)}
          />
        </label>
        <div className="flex gap-2 sm:col-span-2">
          <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button type="button" onClick={cancel} className="rounded border px-4 py-2">
              Cancel
            </button>
          )}
        </div>
      </form>

      <p className="mb-2 text-sm text-gray-600">{total} product(s)</p>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b">
              <th className="p-2">ID</th>
              <th className="p-2"></th>
              <th className="p-2">Title</th>
              <th className="p-2">Category</th>
              <th className="p-2">Price</th>
              <th className="p-2">Stock</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.id}</td>
                <td className="p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.thumbnail} alt={p.title} width={40} height={40} />
                </td>
                <td className="p-2">{p.title}</td>
                <td className="p-2">{p.category.name}</td>
                <td className="p-2">{Number(p.price)}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2 text-right whitespace-nowrap">
                  <button
                    onClick={() => edit(p)}
                    className="mr-2 rounded border border-blue-600 px-2 py-1 text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(p)}
                    className="rounded border border-red-600 px-2 py-1 text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          className="rounded border px-4 py-2 disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button
          className="rounded border px-4 py-2 disabled:opacity-40"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}