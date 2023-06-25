

import React, { useState } from "react";
import axios from "axios";

function Send() {
  const [name, setName] = useState("john");

  const handleClick = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/storeimage",
        { name },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <h1>{name}</h1>
      <button onClick={handleClick}>Send Name to Backend</button>
    </div>
  );
}

export default Send;
