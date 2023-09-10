import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

const FloatingServerInput = ({ onClose, onConfirm, owner,handleonconfirm}) => {
  const [Application, setApplication] = useState('')
  const [hostname, sethostname] = useState('')
  const [IP, setIP] = useState('')

  const [errorMessages, setErrorMessages] = useState({});

  console.log(owner)

const handleConfirm = () => {
    const instance = axios.create({baseURL: 'http://localhost:8000', withCredentials: true})
    instance.post('/api/v2/server/',{
      Application:Application,
      hostname:hostname,
      IP: IP,
      owner: owner.id
      
    })
    .then((response)=>{console.log(response.data)
      handleonconfirm(response.data);
      onConfirm(Application);
    setApplication("");
    sethostname("");
    setIP("");
    onClose();

        }).catch((error) => updateErrorMessages(error))
    


  };

  /* console.log(ownerid)

  const filteredObjects = owner.filter(obj => obj._id === ownerid);

  console.log(filteredObjects)
  console.log(filteredObjects.company) */

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
    <div className="d-flex justify-content-around mt-3">

      <div>
      <input
        type="text"
        placeholder="Application"
        value={Application}
        onChange={(e)=>setApplication(e.target.value)}
      />

      <div className="text-danger fs-6">
              {errorMessages?.data?.Application}
      </div>   
      </div>

      <div>
      <input
        type="text"
        placeholder="hostname"
        value={hostname}
        onChange={(e)=>sethostname(e.target.value)}
      />
      <div className="text-danger fs-6">
              {errorMessages?.data?.hostname}
      </div>  
      </div>

      <div>
      <input
        type="text"
        placeholder="IP"
        value={IP}
        onChange={(e)=>setIP(e.target.value)}
      />
      <div className="text-danger fs-6">
              {errorMessages?.data?.IP}
      </div>
      </div>

      {/* <div>{filteredObjects[0].company}</div> */}
      <button className="btn btn-secondary" onClick={handleConfirm}>Confirm</button>
    </div>
    
  );
};

export default FloatingServerInput;
