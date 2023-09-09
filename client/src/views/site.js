import { useLocation, useNavigate, useParams } from "react-router-dom";
import ServerCards from "../components/serverCards.component";
import FloatingServerInput from "../components/floatingserverinput.component";
import { useState,useEffect } from "react";
import axios from "axios";

import PageTemplate from '../template/PageTemplate';

const SitePage = ()=>{
    const n = useParams()
    const a = useLocation()
    const navigate = useNavigate()

    const [serverscheckToDelete,setserverscheckToDelete ] = useState('')
    const [serversToDelete, setserversToDelete] = useState('')
    const [siteToDelete, setsiteToDelete ] = useState('')


    /* console.log("n  : " +n.id) */

    const [servers, setservers] = useState("")
 

    useEffect(()=>{
        const instance = axios.create({baseURL: 'http://localhost:8000'})
        instance.get('/api/v2/server/owner/'+sitedata._id,{ withCredentials: true})
        .then(response =>  setservers(response.data))
        console.log(servers)
    },[])

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


       const handleonconfirm=(newserver)=>{
         const newservers =[...servers];
         newservers.push(newserver);
         setservers(newservers);
        //  console.log(servers, "servers")
       }

      const deletesite = async () => {
        const instance = axios.create({ baseURL: 'http://localhost:8000', withCredentials: true });
      
        try {
          const response = await instance.get('api/v2/server/owner/' + n.id);
          const serverData = response.data;
      
          // Set the values in a single batch to trigger state updates
          const serverIdsToDelete = [];
          const serverCheckIdsToDelete = [];
      
          for (const server of serverData) {
            serverIdsToDelete.push(server._id);
            const serverResponse = await instance.get('api/v2/server/' + server._id);
            const serverCheckId = serverResponse.data._id;
      
            const serverCheckResponse = await instance.get('api/v2/servercheck/owner/' + serverCheckId);
            const serverCheckData = serverCheckResponse.data[0];
      
            if (serverCheckData) {
              serverCheckIdsToDelete.push(serverCheckData._id);
            }
          }
      
          setserversToDelete(serverIdsToDelete);
          setserverscheckToDelete(serverCheckIdsToDelete);
          setsiteToDelete(n.id);
      
          // Now that the state is updated, perform deletions
          await Promise.all(
            serverCheckIdsToDelete.map(async (serverCheckId) => {
              await instance.delete('api/v2/servercheck/' + serverCheckId);
              console.log('checklistDeleted');
            })
          );
      
          await Promise.all(
            serverIdsToDelete.map(async (serverId) => {
              await instance.delete('api/v2/server/' + serverId);
              console.log('ServerDeleted');
            })
          );
      
          await instance.delete('api/v2/site/' + n.id);
          console.log('SiteDeleted');
          
          // Navigate after all deletions are complete
          navigate('/clients');
        } catch (error) {
          console.log(error);
        }
      };
      



    return(
        <div>
          <PageTemplate  title={sitedata.siteName} isclient={false}>

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
            handleonconfirm={handleonconfirm}
            onClose={closeFloatingServer}
            onConfirm={handleServer}
            owner={n}
            />
            )}
            <div className="summary">
                {sitedata.summary}
            </div>

            <ServerCards  servers={servers}/>
        </div>
        </PageTemplate>
        </div>
    )
}

export default SitePage;