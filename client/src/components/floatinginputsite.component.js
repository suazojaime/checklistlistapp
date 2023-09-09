import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

const FloatingInputSite = ({ onClose, onConfirm, pleaserender,setpleaserender, owner, ownerid }) => {
  const [siteName, setsiteName] = useState('')
  const [acronym, setacronym] = useState('')
  const [country, setcountry] = useState('')
  const [summary, setsummary] = useState('')

const [errorMessages, setErrorMessages] = useState({});

const handleConfirm = () => {
    const instance = axios.create({baseURL: 'http://localhost:8000', withCredentials: true})
    instance.post('/api/v2/site/',{
        siteName:siteName,
        acronym:acronym,
        country: country,
        owner: ownerid,
        summary : summary,
    })
    .then((response)=>{/* console.log(response) */
        setpleaserender(pleaserender+1)
        onConfirm(siteName);
        setsiteName("");
        setacronym("");
        setcountry("");
        setsummary("");
        onClose();
      }).catch((error) => updateErrorMessages(error))
    
    /* window.location.reload(); */

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
    <div className="floating-input-container">
      <div>
      <input
        type="text"
        placeholder="SiteName"
        value={siteName}
        onChange={(e)=>setsiteName(e.target.value)}
        
      />
      <div className="error">
              {errorMessages?.data?.siteName}
      </div>
      </div>

      <div>
      <input
        type="text"
        placeholder="Acronym"
        value={acronym}
        onChange={(e)=>setacronym(e.target.value)}
      />
      <div className="error">
              {errorMessages?.data?.acronym}
      </div>
      </div>

      <div>
      <input
        type="text"
        placeholder="Country"
        value={country}
        onChange={(e)=>setcountry(e.target.value)}
      />
      <div className="error">
              {errorMessages?.data?.country}
      </div>
      </div>



      <input
        type="text"
        placeholder="Summary"
        value={summary}
        onChange={(e)=>setsummary(e.target.value)}
      />
      <div>{filteredObjects[0].company}</div>
      <button onClick={handleConfirm}>Confirm</button>
    </div>
  );
};

export default FloatingInputSite;
