import React, { useState, useEffect } from "react";
import axios from "axios";
const Product = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get("https://fakestoreapi.com/products");
        setProducts(res.data);
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchdata();
  }, []);
  if (!products || products.length === 0) {
    return <h2>Loading...</h2>;
  }

  const filterdata = products.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div style={{ padding: "0px" }}>
      <input
        type="text"
        placeholder="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filterdata.map((item) => ( 
        <div key={item.id}>
          <h3>{item.title}</h3>
          <p>{item.price}</p>
        </div>
      ))}
    </div>
  );
};

export default Product;
