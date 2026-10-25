import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { CategoryWithCount, Product, ProductsResponse } from './models/product';

// Body eli ytab3ath lil API (category = ism el catégorie, tetsana3 ken ma mawjoudach)
export type ProductInput = {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  stock: number;
  category: string;
};

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/products`;

  getProducts(
    limit: number,
    skip: number,
    q = '',
    category = '',
  ): Observable<ProductsResponse> {
    let params = new HttpParams().set('limit', limit).set('skip', skip);
    if (q) params = params.set('q', q);
    if (category) params = params.set('category', category);
    return this.http.get<ProductsResponse>(this.baseUrl, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  getCategories(): Observable<CategoryWithCount[]> {
    return this.http.get<CategoryWithCount[]>(`${environment.apiUrl}/categories`);
  }

  createProduct(body: ProductInput): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, body);
  }

  updateProduct(id: number, body: Partial<ProductInput>): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${id}`, body);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}