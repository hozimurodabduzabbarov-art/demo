import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import SupportWidget from './components/SupportWidget.jsx';

import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Preorder from './pages/Preorder.jsx';
import Delivery from './pages/Delivery.jsx';
import Resale from './pages/Resale.jsx';
import Profile from './pages/Profile.jsx';
import Favorites from './pages/Favorites.jsx';
import CourierTracking from './pages/CourierTracking.jsx';
import SymptomChecker from './pages/SymptomChecker.jsx';

import AdminLayout from './pages/admin/AdminLayout.jsx';
import AdminProducts from './pages/admin/AdminProducts.jsx';
import AdminSales from './pages/admin/AdminSales.jsx';
import AdminOrders from './pages/admin/AdminOrders.jsx';
import AdminResale from './pages/admin/AdminResale.jsx';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/preorder" element={<Preorder />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/resale" element={<Resale />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/tracking/:orderId?" element={<CourierTracking />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminProducts />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="resale" element={<AdminResale />} />
        </Route>
      </Routes>
      <Footer />
      <SupportWidget />
    </>
  );
}
