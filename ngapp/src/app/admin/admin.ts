import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../product';
import { Product } from '../models/product';

@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  private service = inject(ProductService);
  private fb = inject(FormBuilder);

  readonly limit = 10;
  products = signal<Product[]>([]);
  total = signal(0);
  skip = signal(0);
  editingId = signal<number | null>(null);
  message = signal('');
  error = signal('');

  page = computed(() => Math.floor(this.skip() / this.limit) + 1);
  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.limit)));

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    thumbnail: ['', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    category: ['', Validators.required],
  });

  constructor() {
    this.load();
  }

  load() {
    this.service.getProducts(this.limit, this.skip()).subscribe({
      next: (res) => {
        this.products.set(res.products);
        this.total.set(res.total);
      },
      error: () => this.error.set('Unable to load the products'),
    });
  }

  edit(p: Product) {
    this.editingId.set(p.id);
    this.message.set('');
    this.error.set('');
    this.form.patchValue({
      title: p.title,
      description: p.description,
      price: Number(p.price),
      thumbnail: p.thumbnail,
      stock: p.stock,
      category: p.category.name,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancel() {
    this.editingId.set(null);
    this.form.reset();
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.error.set('');
    this.message.set('');
    const body = this.form.getRawValue();
    const id = this.editingId();
    const request = id
      ? this.service.updateProduct(id, body)
      : this.service.createProduct(body);

    request.subscribe({
      next: () => {
        this.message.set(id ? 'Product updated' : 'Product created');
        this.cancel();
        this.load();
      },
      error: (err) =>
        this.error.set(
          err.error?.details?.[0]?.message ?? err.error?.error ?? 'Request failed',
        ),
    });
  }

  remove(p: Product) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    this.service.deleteProduct(p.id).subscribe({
      next: () => {
        this.message.set('Product deleted');
        if (this.products().length === 1 && this.skip() > 0) {
          this.skip.update((s) => s - this.limit);
        }
        this.load();
      },
      error: () => this.error.set('Delete failed'),
    });
  }

  prev() {
    this.skip.update((s) => Math.max(0, s - this.limit));
    this.load();
  }

  next() {
    this.skip.update((s) => s + this.limit);
    this.load();
  }

  hasPrev() {
    return this.skip() > 0;
  }

  hasNext() {
    return this.skip() + this.limit < this.total();
  }
}