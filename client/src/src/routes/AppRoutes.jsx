import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import MilkProducts from '../pages/MilkProducts';
import PaneerAndTofuProducts from '../pages/PaneerAndTofuProducts';
import CurdProducts from '../pages/CurdProducts';
import BreadProducts from '../pages/BreadProducts';
import VermicelliProducts from '../pages/VermicelliProducts';
import PeanutButter from '../pages/PeanutButter';
import UserRegister from '../pages/UserRegister';
import UserLogin from '../pages/UserLogin';
import milk from '../assets/milk.jpg';
import paneer from '../assets/paneer3.jfif';
import curd from '../assets/curd.jfif';
import vermicelli from '../assets/vermicelli.jfif';
import bread from '../assets/bread.jfif';
import peanut from '../assets/peanut.jfif';
import poha from '../assets/poha.jfif';
import bar from '../assets/bars.jfif';
import egg from '../assets/egg2.jfif';
import oats from '../assets/oats.jfif';
import "../components/AppRoute.css";

function AppRoutes() {
  return (
    <div className="app-layout">
      <nav>
        <Link to="/" style={{ textDecoration: 'none', color: "black" }}><img src={milk} alt="Milk" /><p>Milk Products</p></Link>
        <Link to="/PaneerAndTofu" style={{ textDecoration: 'none', color: "black" }}><img src={paneer} alt="Paneer" /><p>Paneer And Tofu</p></Link>
        <Link to="/PeanutButter" style={{ textDecoration: 'none', color: "black" }}><img src={peanut} alt="Peanut Butter" /><p>Peanut Butter</p></Link>
        <Link to="/Curd" style={{ textDecoration: 'none', color: "black" }}><img src={curd} alt="Curd" /><p>Curd</p></Link>
        <Link to="/Bread" style={{ textDecoration: 'none', color: "black" }}><img src={bread} alt="Bread" /><p>Bread</p></Link>
        <Link to="/Vermicelli" style={{ textDecoration: 'none', color: "black" }}><img src={vermicelli} alt="Vermicelli" /><p>Vermicelli</p></Link>
        <Link to="/bar" style={{ textDecoration: 'none', color: "black" }}><img src={bar} alt="Bars" /><p>Bars</p></Link>
        <Link to="/poha" style={{ textDecoration: 'none', color: "black" }}><img src={poha} alt="Poha" /><p>Poha</p></Link>
        <Link to="/oats" style={{ textDecoration: 'none', color: "black" }}><img src={oats} alt="Oats" /><p>Oats</p></Link>
        <Link to="/egg" style={{ textDecoration: 'none', color: "black" }}><img src={egg} alt="Eggs" /><p>Eggs</p></Link>
      </nav>

      <main className="route-content">
        <Routes>
          <Route path="/" element={<MilkProducts />} />
          <Route path="/PaneerAndTofu" element={<PaneerAndTofuProducts />} />
          <Route path="/PeanutButter" element={<PeanutButter />} />
          <Route path="/Curd" element={<CurdProducts />} />
          <Route path="/Bread" element={<BreadProducts />} />
          <Route path="/Vermicelli" element={<VermicelliProducts />} />
          <Route path="/bar" element={<></>} />
          <Route path="/poha" element={<></>} />
          <Route path="/oats" element={<></>} />
          <Route path="/egg" element={<></>} />
          <Route path="/register" element={<UserRegister />} />
          <Route path="/login" element={<UserLogin />} />
        </Routes>
      </main>
    </div>
  );
}

export default AppRoutes;
