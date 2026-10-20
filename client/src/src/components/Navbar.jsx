
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

import website_Logo from '../assets/logo.svg';
import search_icon from '../assets/search.svg';
import userIcon from '../assets/user.svg';
import cart from '../assets/cart.svg';

import {
  setSearch,
  clearSearch,
} from '../store/searchProducts.js';

import Location from '../pages/Location.jsx';
import AddToCart from '../pages/AddCart.jsx';
import UserMenu from '../pages/UserMenu.jsx';
import { useAuth } from '../pages/AuthContext.jsx';

function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Search value Redux se aayegi
  const search = useSelector(
    (state) => state.searchProducts.search
  );

  const cartItems = useSelector(
    (state) => state.cart.items || []
  );

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  // Search input change
  const handleSearch = (e) => {
    dispatch(setSearch(e.target.value));
  };

  // Logo click karne par search clear
  const handleHome = () => {
    dispatch(clearSearch());
    navigate('/');
  };

  return (
    <>
      <div className="navBar">
        <div className="navBar-content">

          <div
            className="website-logo"
            onClick={handleHome}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleHome();
              }
            }}
          >
            <div>
              <img src={website_Logo} alt="farmEra logo" />
            </div>

            <div className="brand-name">
              farm<span>Era</span>
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
              placeholder="Search for products"
              value={search}
              onChange={handleSearch}
              aria-label="Search products"
            />

            {search && (
              <button
                type="button"
                onClick={() => dispatch(clearSearch())}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {!loading && (
            user ? (
              <UserMenu iconSrc={userIcon} />
            ) : (
              <button
                type="button"
                className="user"
                onClick={() => navigate('/register')}
                aria-label="Open account"
              >
                <img src={userIcon} alt="User account" />
              </button>
            )
          )}

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
                  <span className="cart-count">
                    {cartCount}
                  </span>
                )}
              </span>
            </button>
          </div>

        </div>
      </div>

      {cartOpen && (
        <AddToCart closeCart={() => setCartOpen(false)} />
      )}
    </>
  );
}

export default Navbar;