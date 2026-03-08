import axios from "axios";
import React, { useEffect, useState } from "react";
import Productlist from "./Productlist";
import Card from "./Card";

const Get = () => {
  const [data, setdata] = useState([]);
  const [card, setcard] = useState([]);

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

  const addtocard = (data) => {
    setcard([...card, data]);
  };
  const removetocard = (id) => {
    setcard(card.filter((item) => item.id !== id));
  };

  return (
    <div>
      <Productlist
        data={data}
        card={card}
        addtocard={addtocard}
        removetocard={removetocard}
      />
      <Card card={card} removetocard={removetocard} />
    </div>
  );
};

export default Get;
