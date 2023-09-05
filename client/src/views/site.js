import { useLocation, useNavigate, useParams } from "react-router-dom";
import ServerCards from "../components/serverCards.component";
import FloatingServerInput from "../components/floatingserverinput.component";
import { useState } from "react";
import axios from "axios";

const SitePage = ()=>{
    const n = useParams()
    const a = useLocation()
    const navigate = useNavigate()

    console.log("n  : " +n.id)



    /* console.log(n)
    console.log(a.state) */
    const sitedata = a.state

    const [FloatingServer, setFloatingServer] = useState('')
    const [inputserver, setinputserver] = useState('')

    const addserver = () => {
        // Open the floating input when the "Add Site" button is clicked
        setFloatingServer(true);
      };
    
      const closeFloatingServer = () => {
        // Close the floating input and clear input value
        setFloatingServer(false);
        setinputserver("");
      };
    
      const handleServer = (value) => {
        // Handle the input data (e.g., send it to the server)
        console.log("Input Value:", value);
        closeFloatingServer();
      };

      const deletesite = ()=>{
        const instance = axios.create({baseURL: 'http://localhost:8000', withCredentials: true})
        
        try{
            instance.delete('/api/v2/site/'+n.id)
            navigate('/clients')
        }
        catch(error){console.log(error)}
    }
    




    return(
        <div>
            <div className="logregbanner clientsBar">
                {sitedata.siteName}
            </div>

        <div className="bigdiv">
            <div className="ServerButtonsWrapper">
                <div className="Addclientwrapper">
                    <div className="addclienbutton" onClick={()=>addserver()}>+</div>
                    <div>Add server</div>
                </div>

                <div className="Addclientwrapper">
                    <div className="removeclientbutton" onClick={()=>deletesite()}>+</div>
                    <div>Remove site</div>
                </div>
            </div>
            {FloatingServer && (
            <FloatingServerInput 
            onClose={closeFloatingServer}
            onConfirm={handleServer}
            owner={n}
            />
            )}
            <div className="summary">
                {sitedata.summary}
            </div>

            <ServerCards siteid = {sitedata._id} sitedata={sitedata}/>
        </div>
        </div>
    )
}

export default SitePage;