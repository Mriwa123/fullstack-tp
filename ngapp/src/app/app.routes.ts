import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Contact } from './contact/contact';
import { ProductList } from './product-list/product-list';
import { ProductDetail } from './product-detail/product-detail';
import { Admin } from './admin/admin';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'contact', component: Contact },
  { path: 'contact/:id', component: Contact },
  { path: 'products', component: ProductList },
  { path: 'products/:id', component: ProductDetail },
  { path: 'admin', component: Admin },
];