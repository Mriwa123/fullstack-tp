import { Component, computed, inject, signal } from '@angular/core';
import { ProductService } from '../product';
import { CategoryWithCount, Product } from '../models/product';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  private service = inject(ProductService);

  readonly limit = 12;
  products = signal<Product[]>([]);
  categories = signal<CategoryWithCount[]>([]);
  total = signal(0);
  skip = signal(0);
  q = signal('');
  category = signal('');
  loading = signal(true);
  error = signal('');

  page = computed(() => Math.floor(this.skip() / this.limit) + 1);
  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.limit)));

  constructor() {
    this.service.getCategories().subscribe({
      next: (cats) => this.categories.set(cats),
    });
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.service
      .getProducts(this.limit, this.skip(), this.q(), this.category())
      .subscribe({
        next: (res) => {
          this.products.set(res.products);
          this.total.set(res.total);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Unable to load the products');
          this.loading.set(false);
        },
      });
  }

  search(q: string, category: string) {
    this.q.set(q.trim());
    this.category.set(category);
    this.skip.set(0);
    this.load();
  }

  reset() {
    this.search('', '');
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