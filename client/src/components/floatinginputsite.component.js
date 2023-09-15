import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import _ from "lodash";
import {baseUrl} from '../config.js'

const FloatingInputSite = ({show, onHide, onClose, onConfirm, pleaserender,setpleaserender, owner, ownerid, handleonconfirm }) => {
  const [siteName, setsiteName] = useState('')
  const [acronym, setacronym] = useState('')
  const [country, setcountry] = useState('')
  const [summary, setsummary] = useState('')

const [errorMessages, setErrorMessages] = useState({});

const handleConfirm = () => {
    const instance = axios.create({baseURL: baseUrl, withCredentials: true})
    instance.post('/api/v2/site/',{
        siteName:siteName,
        acronym:acronym,
        country: country,
        owner: ownerid,
        summary : summary,
    })
    .then((response)=>{console.log(response)
      handleonconfirm(response.data);
      setpleaserender(pleaserender+1)
      onConfirm(siteName);
      onHide();
  setsiteName("");
  setacronym("");
  setcountry("");
  setsummary("");
  onClose();
    
    }).catch((error) => updateErrorMessages(error))
  
  
  // window.location.reload();

  };

  /* console.log(ownerid) */

  const filteredObjects = owner.filter(obj => obj._id === ownerid);

 /*  console.log(filteredObjects)
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
        placeholder="SiteName"
        value={siteName}
        onChange={(e)=>setsiteName(e.target.value)}
        className="form-control mb-3"
        
      />
      <div className="text-danger mb-3 text-center">
              {errorMessages?.data?.siteName}
      </div>
      </div>

      <div>
      <input
        type="text"
        placeholder="Acronym"
        value={acronym}
        onChange={(e)=>setacronym(e.target.value)}
        className="form-control mb-3"
      />
      <div className="text-danger mb-3 text-center">
              {errorMessages?.data?.acronym}
      </div>
      </div>

      <div>
      <input
        type="text"
        placeholder="Country"
        value={country}
        onChange={(e)=>setcountry(e.target.value)}
        className="form-control mb-3"
      />
      <div className="text-danger mb-3 text-center">
              {errorMessages?.data?.country}
      </div>
      </div>



      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(e)=>setsummary(e.target.value)}
        className="form-control mb-3"
      />
      <div className="text-center">
        <p>Add Site To: {filteredObjects[0].company}</p>
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

export default FloatingInputSite;
