import axios from "axios";
import React, { useState } from "react";

const FloatingInput = ({ onClose, onConfirm, pleaserender,setpleaserender }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleConfirm = () => {
    const instance = axios.create({baseURL: 'http://localhost:8000', withCredentials: true})
    instance.post('/api/v2/company/',{company:inputValue})
    .then((response)=>{console.log(response)
        setpleaserender(pleaserender+1)}).catch((error) => console.log(error))
    onConfirm(inputValue);
    setInputValue("");
    onClose();
  };



  return (
    <div className="floating-input-container">
      <input
        type="text"
        placeholder="Customer name"
        value={inputValue}
        onChange={handleInputChange}
      />
      <button onClick={handleConfirm}>Confirm</button>
    </div>
  );
};

export default FloatingInput;
