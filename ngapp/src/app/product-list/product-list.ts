import { Component, inject, signal } from '@angular/core';
import { ProductService } from '../product';
import { Product } from '../models/product';
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
  total = signal(0);
  skip = signal(0);
  loading = signal(true);
  error = signal('');

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.service.getProducts(this.limit, this.skip()).subscribe({
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