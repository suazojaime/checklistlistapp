import axios from "axios";
import React, { useState,useEffect } from "react";
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import {baseUrl} from '../config.js'

const FloatingServerInput = ({ show, onHide, onClose, onConfirm, owner,handleonconfirm}) => {
  const [Application, setApplication] = useState('')
  const [hostname, sethostname] = useState('')
  const [IP, setIP] = useState('')

  const [errorMessages, setErrorMessages] = useState({});

  

    console.log(show,"show");


const handleConfirm = () => {
    const instance = axios.create({baseURL: baseUrl, withCredentials: true})
    instance.post('/api/v2/server/',{
      Application:Application,
      hostname:hostname,
      IP: IP,
      owner: owner.id
      
    })
    .then((response)=>{console.log(response.data)
      handleonconfirm(response.data);
      onConfirm(Application);
      onHide();
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
    
      <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Server</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
      <input
        type="text"
        placeholder="Application"
        value={Application}
        onChange={(e)=>setApplication(e.target.value)}
        className="form-control mb-3"
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
        className="form-control mb-3"
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
        className="form-control"
      />
      <div className="text-danger fs-6">
              {errorMessages?.data?.IP}
      </div>
      </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
     
    
  );
};

export default FloatingServerInput;
