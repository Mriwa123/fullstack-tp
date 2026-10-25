"use client";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Form submitted:", formData);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4">
      <input
        className="rounded border px-3 py-1"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        className="rounded border px-3 py-1"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
        type="submit"
        disabled={!formData.name || !formData.email}
      >
        Submit
      </button>
    </form>
  );
}