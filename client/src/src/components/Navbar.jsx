
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import website_Logo from '../assets/logo.svg';
import search_icon from '../assets/search.svg';
import user from '../assets/user.svg';
import cart from '../assets/cart.svg';
import { searchProducts } from '../store/searchProducts.js';
import Location from '../pages/Location.jsx';
import AddToCart from '../pages/AddCart.jsx';
import UserRegister from '../pages/UserRegister.jsx';

function Navbar() {
  const [search, setSearch] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items || []);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    dispatch(searchProducts(value));
  };

  return (
    <>
      <div className="navBar">
        <div className="navBar-content">
          <div
            className="website-logo"
            onClick={() => navigate('/')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/');
              }
            }}
          >
            <div>
              <img src={website_Logo} alt="farmEra logo" />
            </div>

            <div className="brand-name">
              <h3>farmEra</h3>
              <p>fresh from Nature</p>
            </div>
          </div>

          <div className="current-address">
            <h3>Delivery in 8 minutes</h3>
            <Location />
          </div>

          <div className="search-bar">
            <div className="search-icon">
              <img src={search_icon} alt="Search" />
            </div>

            <input
              type="text"
              placeholder="Search for"
              value={search}
              onChange={handleSearch}
              aria-label="Search products"
            />
          </div>

          <button
            type="button"
            className="user"
            onClick={() => setAuthOpen(true)}
            aria-label="Open account"
          >
            <img src={user} alt="User account" />
          </button>

          <div>
            <button
              type="button"
              className="btn"
              onClick={() => setCartOpen(true)}
              aria-label="Open shopping cart"
            >
              <img
                src={cart}
                alt="Cart"
                style={{ height: '28px' }}
              />

              <span>
                My cart
                {cartCount > 0 && (
                  <span className="cart-count">{cartCount}</span>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {cartOpen && (
        <AddToCart closeCart={() => setCartOpen(false)} />
      )}

      {authOpen && (
        <UserRegister onClose={() => setAuthOpen(false)} />
      )}
    </>
  );
}

export default Navbar;
