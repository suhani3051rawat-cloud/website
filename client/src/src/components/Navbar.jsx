
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./Navbar.css";

import website_Logo from "../assets/logo.svg";
import search_icon from "../assets/search.svg";
import userIcon from "../assets/user.svg";
import cart from "../assets/cart.svg";

import {
  setSearch,
  clearSearch,
  searchProducts,
} from "../store/searchProducts.js";

import Location from "../pages/Location.jsx";
import AddToCart from "../pages/AddCart.jsx";
import UserMenu from "../pages/UserMenu.jsx";
import { useAuth } from "../pages/AuthContext.jsx";

function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const { user, loading } = useAuth();

  const cartItems = useSelector(
    (state) => state.cart?.items || []
  );

  const search = useSelector(
    (state) => state.searchProducts?.search || ""
  );

  const products = useSelector(
    (state) => state.searchProducts?.products || []
  );

  const searchLoading = useSelector(
    (state) => state.searchProducts?.loading || false
  );

  const searchError = useSelector(
    (state) => state.searchProducts?.error
  );

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 0),
    0
  );

  useEffect(() => {
    if (!user || loading) {
      setCartOpen(false);
    }
  }, [user, loading]);

  useEffect(() => {
    const query = search.trim();

    if (query.length < 2) {
      dispatch(searchProducts(""));
      return;
    }

    const timer = setTimeout(() => {
      dispatch(searchProducts(query));
    }, 300);

    return () => clearTimeout(timer);
  }, [search, dispatch]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSearch(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSearch = (event) => {
    dispatch(setSearch(event.target.value));
    setShowSearch(true);
  };

  const getProductName = (product) =>
    product.product_name ||
    product.name ||
    product.title ||
    "Product";

  const getProductImage = (product) => {
    const image =
      product.images?.[0] ||
      product.image?.[0] ||
      product.image ||
      product.product_image;

    return typeof image === "string" ? image : image?.url || "";
  };

  const getProductPrice = (product) =>
    product.price ??
    product.selling_price ??
    product.discountedPrice ??
    product.mrp ??
    "";

  const getCategoryText = (product) => {
    const category = product.category;
    const categoryId = product.category_id;

    return [
      typeof category === "string" ? category : "",
      category?.name,
      category?.category_name,
      category?.title,
      product.category_name,
      product.categoryName,
      typeof categoryId === "object" ? categoryId?.name : "",
      typeof categoryId === "object" ? categoryId?.category_name : "",
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
  };

  const getProductRoute = (product) => {
    const categoryText = getCategoryText(product);
    const productName = getProductName(product).toLowerCase();
    const searchText = search.toLowerCase();

    const combinedText = `${categoryText} ${productName}`;

    if (
      combinedText.includes("peanut") ||
      combinedText.includes("butter") ||
      searchText.includes("butter")
    ) {
      return "/PeanutButter";
    }

    if (
      combinedText.includes("paneer") ||
      combinedText.includes("tofu")
    ) {
      return "/PaneerAndTofu";
    }

    if (combinedText.includes("milk")) {
      return "/MilkProducts";
    }

    if (combinedText.includes("curd")) {
      return "/Curd";
    }

    if (combinedText.includes("bread")) {
      return "/Bread";
    }

    if (combinedText.includes("vermicelli")) {
      return "/Vermicelli";
    }

    if (combinedText.includes("bar")) {
      return "/bar";
    }

    if (combinedText.includes("poha")) {
      return "/poha";
    }

    if (combinedText.includes("oats")) {
      return "/oats";
    }

    if (combinedText.includes("egg")) {
      return "/egg";
    }

    return "/";
  };

  const handleProductClick = (product) => {
    const route = getProductRoute(product);

    setShowSearch(false);
    dispatch(clearSearch());
    navigate(route);
  };

  const handleHome = () => {
    dispatch(clearSearch());
    setShowSearch(false);
    setCartOpen(false);
    navigate("/");
  };

  const handleClearSearch = () => {
    dispatch(clearSearch());
    setShowSearch(false);
  };

  const handleCartClick = () => {
    if (loading) return;

    if (!user) {
      navigate("/login");
      return;
    }

    setCartOpen((prev) => !prev);
  };

  return (
    <>
      <header className="navBar">
        <div className="navBar-content">

          <button
            type="button"
            className="website-logo"
            onClick={handleHome}
            aria-label="Go to FarmEra homepage"
          >
            <img src={website_Logo} alt="FarmEra" />

            <div className="brand-name">
              <span className="brand-title">
                farm<span>Era</span>
              </span>
              <p>fresh from Nature</p>
            </div>
          </button>

          <div className="current-address">
            <div className="delivery-label">
              <span className="delivery-dot"></span>
              <h3>Delivery in 8 minutes</h3>
            </div>
            <Location />
          </div>

          <div className="search-wrapper" ref={searchRef}>
            <div className="search-bar">
              <img
                src={search_icon}
                alt=""
                className="search-icon"
              />

              <input
                type="search"
                placeholder="Search for milk, paneer, bread..."
                value={search}
                onChange={handleSearch}
                onFocus={() => setShowSearch(true)}
                aria-label="Search products"
              />

              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={handleClearSearch}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {showSearch && search.trim().length >= 2 && (
              <div className="search-results-dropdown">

                <div className="search-results-heading">
                  <span>Products</span>

                  {!searchLoading && products.length > 0 && (
                    <small>{products.length} results</small>
                  )}
                </div>

                {searchLoading && (
                  <div className="search-status">
                    Searching products...
                  </div>
                )}

                {!searchLoading && searchError && (
                  <div className="search-status search-error-text">
                    {searchError}
                  </div>
                )}

                {!searchLoading &&
                  !searchError &&
                  products.length === 0 && (
                    <div className="search-status">
                      No products found for "{search}"
                    </div>
                  )}

                {!searchLoading &&
                  products.map((product, index) => {
                    const productImage = getProductImage(product);
                    const productPrice = getProductPrice(product);

                    return (
                      <button
                        type="button"
                        className="search-product-row"
                        key={product._id || product.id || index}
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="search-product-image">
                          {productImage ? (
                            <img
                              src={productImage}
                              alt={getProductName(product)}
                            />
                          ) : (
                            <span>🌿</span>
                          )}
                        </div>

                        <div className="search-product-info">
                          <h4>{getProductName(product)}</h4>

                          {product.brand && (
                            <p>{product.brand}</p>
                          )}
                        </div>

                        <div className="search-product-right">
                          {productPrice !== "" && (
                            <strong>₹{productPrice}</strong>
                          )}
                          <span>›</span>
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}
          </div>

          <div className="user-section">
            {!loading &&
              (user ? (
                <UserMenu iconSrc={userIcon} />
              ) : (
                <button
                  type="button"
                  className="user"
                  onClick={() => navigate("/login")}
                  aria-label="Login to your account"
                >
                  <img src={userIcon} alt="" />
                  <span>Login</span>
                </button>
              ))}
          </div>

          <button
            type="button"
            className="btn"
            onClick={handleCartClick}
            disabled={loading}
            aria-label={`Open cart, ${cartCount} items`}
          >
            <img src={cart} alt="" />
            <span>My Cart</span>

            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </button>

        </div>
      </header>

      {cartOpen && user && !loading && (
        <AddToCart closeCart={() => setCartOpen(false)} />
      )}
    </>
  );
}

export default Navbar;
