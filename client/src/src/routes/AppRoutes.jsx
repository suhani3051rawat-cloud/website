
import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Categories from '../pages/Categories';
import MilkProducts from '../pages/MilkProducts';
import PaneerAndTofuProducts from '../pages/PaneerAndTofuProducts';
import CurdProducts from '../pages/CurdProducts';
import BreadProducts from '../pages/BreadProducts';
import VermicelliProducts from '../pages/VermicelliProducts';
import PeanutButter from '../pages/PeanutButter';

import UserRegister from '../pages/UserRegister';
import UserLogin from '../pages/UserLogin';
import PublicOnlyRoute from '../pages/PublicOnlyRoute';

function AppRoutes() {
  return (
    <div className="app-layout">
      <main className="route-content">
        <Routes>
          <Route path="/" element={<Categories />} />

          <Route path="/MilkProducts" element={<MilkProducts />} />
          <Route path="/PaneerAndTofu" element={<PaneerAndTofuProducts />} />
          <Route path="/PeanutButter" element={<PeanutButter />} />
          <Route path="/Curd" element={<CurdProducts />} />
          <Route path="/Bread" element={<BreadProducts />} />
          <Route path="/Vermicelli" element={<VermicelliProducts />} />

          <Route path="/bar" element={<div>Bars Products Coming Soon</div>} />
          <Route path="/poha" element={<div>Poha Products Coming Soon</div>} />
          <Route path="/oats" element={<div>Oats Products Coming Soon</div>} />
          <Route path="/egg" element={<div>Egg Products Coming Soon</div>} />
          <Route path="/product/:id" element={<ProductDetails />} />

          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <UserRegister />
              </PublicOnlyRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <UserLogin />
              </PublicOnlyRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default AppRoutes;
