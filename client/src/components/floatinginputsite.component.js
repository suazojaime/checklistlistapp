import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FloatingInputSite = ({ onClose, onConfirm, pleaserender,setpleaserender, owner, ownerid }) => {
  const [siteName, setsiteName] = useState('')
  const [acronym, setacronym] = useState('')
  const [country, setcountry] = useState('')
  const [summary, setsummary] = useState('')

const handleConfirm = () => {
    const instance = axios.create({baseURL: 'http://localhost:8000', withCredentials: true})
    instance.post('/api/v2/site/',{
        siteName:siteName,
        acronym:acronym,
        country: country,
        owner: ownerid,
        summary : summary,
    })
    .then((response)=>{console.log(response)
        setpleaserender(pleaserender+1)}).catch((error) => console.log(error))
    onConfirm(siteName);
    setsiteName("");
    setacronym("");
    setcountry("");
    setsummary("");
    onClose();
    window.location.reload();

  };

  console.log(ownerid)

  const filteredObjects = owner.filter(obj => obj._id === ownerid);

  console.log(filteredObjects)
  console.log(filteredObjects.company)



  return (
    <div className="floating-input-container">
      <input
        type="text"
        placeholder="SiteName"
        value={siteName}
        onChange={(e)=>setsiteName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Acronym"
        value={acronym}
        onChange={(e)=>setacronym(e.target.value)}
      />
      <input
        type="text"
        placeholder="Country"
        value={country}
        onChange={(e)=>setcountry(e.target.value)}
      />
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
