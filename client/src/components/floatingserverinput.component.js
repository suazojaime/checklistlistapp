import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FloatingServerInput = ({ onClose, onConfirm, owner,handleonconfirm}) => {
  const [Application, setApplication] = useState('')
  const [hostname, sethostname] = useState('')
  const [IP, setIP] = useState('')

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
        }).catch((error) => console.log(error))
    onConfirm(Application);
    setApplication("");
    sethostname("");
    setIP("");
    onClose();


  };

  /* console.log(ownerid)

  const filteredObjects = owner.filter(obj => obj._id === ownerid);

  console.log(filteredObjects)
  console.log(filteredObjects.company) */



  return (
    <div className="serverinput">
      <input
        type="text"
        placeholder="Application"
        value={Application}
        onChange={(e)=>setApplication(e.target.value)}
      />
      <input
        type="text"
        placeholder="hostname"
        value={hostname}
        onChange={(e)=>sethostname(e.target.value)}
      />
      <input
        type="text"
        placeholder="IP"
        value={IP}
        onChange={(e)=>setIP(e.target.value)}
      />
      {/* <div>{filteredObjects[0].company}</div> */}
      <button onClick={handleConfirm}>Confirm</button>
    </div>
  );
};

export default FloatingServerInput;
