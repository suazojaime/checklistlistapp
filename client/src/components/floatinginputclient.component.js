import axios from "axios";
import React, { useState } from "react";
import _ from "lodash";

const FloatingInput = ({ onClose, onConfirm, pleaserender,setpleaserender }) => {
  const [inputValue, setInputValue] = useState("");

  const [errorMessages, setErrorMessages] = useState({});

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleConfirm = () => {
    const instance = axios.create({baseURL: 'http://localhost:8000', withCredentials: true})
    instance.post('/api/v2/company/',{company:inputValue})
    .then((response)=>{console.log(response)
        setpleaserender(pleaserender+1)
        onConfirm(inputValue);
        setInputValue("");
        onClose();          
      }).catch((error) => updateErrorMessages(error))
    
  };

  

  const updateErrorMessages = (err) => {
    /* console.log(err) */
    let errorMessagesToUpdate = {};
    let errors = err.response;
    /* console.log(errors) */
    errorMessagesToUpdate = _.mapValues(errors, (error) => error.error);
    setErrorMessages(errorMessagesToUpdate);
    console.log(errorMessagesToUpdate)
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
      <div className="error">
              {errorMessages?.data?.company}
      </div>
    </div>
  );
};

export default FloatingInput;
