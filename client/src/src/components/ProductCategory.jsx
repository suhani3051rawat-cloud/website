import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { products } from "../store/productSlice.js";
import { searchProducts } from "../store/searchProducts.js";
import { addToCart } from "../store/cartSlice.js";
import "./products.css";

function ProductCategory({ category }) {
  const dispatch = useDispatch();

  const {
    products: productList = [],
    loading: productLoading,
    error: productError
  } = useSelector((state) => state.products);

  const {
    search = "",
    products: searchProductList = [],
    loading: searchLoading,
    error: searchError
  } = useSelector((state) => state.searchProducts);

  const query = search.trim();

  useEffect(() => {
    if (query) {
      dispatch(searchProducts(query));
      return;
    }

    dispatch(products(category));
  }, [query, category, dispatch]);

  const isSearching = Boolean(query);
  const list = isSearching ? searchProductList : productList;
  const loading = isSearching ? searchLoading : productLoading;
  const error = isSearching ? searchError : productError;

  if (loading && list.length === 0) {
    return (
      <div className="product-container">
        <h3>Searching products...</h3>
      </div>
    );
  }

  if (!loading && isSearching && list.length === 0 && !error) {
    return (
      <div className="product-container">
        <div
          style={{
            width: "100%",
            padding: "60px 20px",
            textAlign: "center"
          }}
        >
          <h3>No products found</h3>
          <p>
            We couldn't find anything for "{search}". Try another name.
          </p>
        </div>
      </div>
    );
  }

  if (error && list.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "30px" }}>
        <p>{typeof error === "string" ? error : "Unable to load products."}</p>
      </div>
    );
  }

  return (
    <div className="product-container">
      {list.map((product) => (
        <div className="product-card" key={product._id}>
          <img src={product.image} alt={product.name} />
          <h3>{product.brand}</h3>
          <h4>{product.name}</h4>
          <p>{product.description}</p>

          <div className="price">
            <p>₹{product.price}</p>
            <button onClick={() => dispatch(addToCart(product))}>
              Add
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductCategory;