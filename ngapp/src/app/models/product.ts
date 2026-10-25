export interface Category {
  id: number;
  name: string;
}

export interface CategoryWithCount {
  id: number;
  name: string;
  _count: { products: number };
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: string | number;
  thumbnail: string;
  stock: number;
  category: Category;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}