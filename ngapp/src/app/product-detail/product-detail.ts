import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../product';
import { Product } from '../models/product';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  private route = inject(ActivatedRoute);
  private service = inject(ProductService);

  product = signal<Product | null>(null);
  error = signal('');

  constructor() {
    this.route.paramMap.subscribe((params) => {
      this.product.set(null);
      this.error.set('');
      this.service.getProduct(Number(params.get('id'))).subscribe({
        next: (p) => this.product.set(p),
        error: () => this.error.set('Product not found'),
      });
    });
  }
}