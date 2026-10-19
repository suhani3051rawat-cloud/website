import { products } from "../store/productSlice";
import { searchProducts } from "../store/searchProducts.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { addToCart } from "../store/cartSlice.js";
import React from 'react'

function MilkProducts() {
  const {
    products: productList = [],
    loading,
    error
  } = useSelector((state) => state.products);

  const {
    search,
    products: searchProductList = [],
  } = useSelector((state) => state.searchProducts);

  const dispatch = useDispatch();
  const lastRequest = useRef("");

  useEffect(() => {
    const query = (search || "").trim();
    const requestKey = query ? `search:${query}` : "category:Milk";

    if (lastRequest.current === requestKey) {
      return;
    }

    const timer = setTimeout(() => {
      lastRequest.current = requestKey;

      if (query) {
        dispatch(searchProducts(query));
      } else {
        dispatch(products("Milk"));
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [search, dispatch]);

  if (error && !search) {
    return <h2>{error}</h2>;
  }

  if (loading && !search && productList.length === 0) {
    return <h3>Loading.....</h3>;
  }

  const list = search ? searchProductList : productList;

  if (search && list.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          padding: "60px 20px",
          textAlign: "center"
        }}
      >
        <h3>No products found</h3>
        <p>We couldn't find anything for "{search}". Try another name.</p>
      </div>
    );
  }

  return (
    <div className="product-container">
      {list.map((product, index) => (
        <div className="product-card" key={product._id || index}>
          <img src={product.image} alt={product.name} />
          <h3>{product.brand}</h3>
          <h4>{product.name}</h4><br />
          <p>{product.description}</p>
          <div className="price">
            <p style={{ paddingTop: "8px" }}>₹{product.price}</p>
            <button onClick={() => dispatch(addToCart(product))}>Add</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MilkProducts