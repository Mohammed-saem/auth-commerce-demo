import axios from "axios";
import React, { useEffect, useState } from "react";
import Productlist from "./Productlist";

const Get = ({ card, addtocard, removetocard }) => {
  const [data, setdata] = useState([]);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get("https://dummyjson.com/products?limit=10");
        setdata(res.data.products);
      } catch (error) {
        console.log(error);
      }
    };
    fetchdata();
  }, []);

  return (
    <div>
      <Productlist
        data={data}
        card={card}
        addtocard={addtocard}
        removetocard={removetocard}
      />
    </div>
  );
};

export default Get;