import { products } from "../store/productSlice";
import { searchProducts } from "../store/searchProducts.js";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import {addToCart} from "../store/cartSlice.js";
import React from 'react'

function VerimicelliProducts() {
  let {
    products : productList ,
    loading ,
    error
  } = useSelector((state) => state.products);
  let {
    search ,
    products: searchProductList = [],
  } = useSelector((state) => state.searchProducts); 
  let dispatch  = useDispatch(); 
  const lastRequest = useRef("");

useEffect(() => {
  const query = (search || "").trim();
  const requestKey = query ? `search:${query}` : "category:Vermicelli";

  if (lastRequest.current === requestKey) return;

  const timer = setTimeout(() => {
    lastRequest.current = requestKey;
    if (query) {
      dispatch(searchProducts(query));
    } else {
      dispatch(products("Vermicelli"));
    }
  }, 350);

  return () => clearTimeout(timer);
}, [search, dispatch]);
  useEffect(()=>{
    if(search) {
      dispatch(searchProducts(search));
    }
    else {
    dispatch(products("Vermicelli"));
    }
},[search, dispatch]);
  if (loading && !search && productList.length === 0) {
  return <h3>Loading.....</h3>;
}

if (search && searchProductList.length === 0) {
  return (
    <div style={{ width: "100%", padding: "60px 20px", textAlign: "center" }}>
      <h3>No products found</h3>
      <p>Try another name.</p>
    </div>
  );
}
  if (error) {
        return <h2>{error}</h2>;
  }
  return (
    <>
     {
    search
        ? (
        <>
           <div className="product-container">
     { 
      searchProductList?.map((product, index)=>(
        <div className="product-card" key={index}>
          <img src={product.image}/>
          <h3>{product.brand}</h3>
          <h4>{product.name}</h4><br/>
          <p>{product.description}</p>
          <div className="price"><p style={{ paddingTop : "8px"}}>₹{product.price}</p><button onClick={() =>dispatch(addToCart(product))}>Add</button></div>
        </div>
      ))
     }
    </div>
        </>)
        : (
          <>
           <div className="product-container">
     { 
      productList.map((product, index)=>(
        <div className="product-card" key={index}>
          <img src={product.image}/>
          <h3>{product.brand}</h3>
          <h4>{product.name}</h4><br/>
          <p>{product.description}</p>
          <div className="price"><p style={{ paddingTop : "8px"}}>₹{product.price}</p><button onClick={() =>dispatch(addToCart(product))}>Add</button></div>
        </div>
      ))
     }
    </div>
          </>
        )
      }
    </>
  )
}

export default VerimicelliProducts