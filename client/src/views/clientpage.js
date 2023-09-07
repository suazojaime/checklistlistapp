import { useEffect, useState } from "react";
import axios from 'axios';
/* import 'bootstrap/dist/css/bootstrap.min.css'; */
import '../mystyle.css'
import SiteCard from "../components/siteCard.component";
import { useNavigate } from "react-router-dom";
import FloatingInput from "../components/floatinginputclient.component";
import FloatingInputSite from "../components/floatinginputsite.component";
import Popup from 'reactjs-popup';


const ClientPage = () => {

    const [clients, setclients] = useState('')
    const [sites, setsites] = useState('')
    const [fileteredsites, setfileteredsites] = useState('')
    const navigate =  useNavigate()
    const [pleaserender, setpleaserender] = useState(0)

    const [isFloatingInputOpen, setIsFloatingInputOpen] = useState(false); // State to control the visibility of the floating input
    const [inputValue, setInputValue] = useState(""); // State to store the input value

    const [isFloatingSite, setisFloatingSite] = useState(false); // State to control the visibility of the floating input
    const [inputsite, setinputsite] = useState(""); // State to store the input value

    const [clientid, setclientid] = useState('')

    const [serverscheckToDelete,setserverscheckToDelete ] = useState('')
    const [serversToDelete, setserversToDelete] = useState('')
    const [siteToDelete, setsiteToDelete ] = useState('')

    useEffect(()=>{
        const instance = axios.create({baseURL: 'http://localhost:8000'})
        instance.get('/api/v2/company',{ withCredentials: true})
        .then(response =>  setclients(response.data))
    },[pleaserender])

   useEffect(()=>{
        const instance = axios.create({baseURL: 'http://localhost:8000'})
        instance.get('/api/v2/site',{ withCredentials: true})
        .then(response =>  setsites(response.data))
        .catch((error) => console.log('error'))
    },[pleaserender])


    const getClientDetails = (props) => {
        /* console.log(props) */
        
        
        if(sites){
        const filteredObjects = sites.filter(obj => obj.owner._id === props);
        /* console.log(filteredObjects) */
        setfileteredsites(filteredObjects)
        setclientid(props)
        return('')}
        else{return('')}
    }

    const logout = ()=>{
        const instance = axios.create({baseURL: 'http://localhost:8000'})
        instance.get('/user/logout',{ withCredentials: true})
        .then(response =>  {console.log(response)
        navigate('/login')})
        .catch((error) => console.log('error'))
        
    }


    const addclient = () => {
        // Open the floating input when the "Add Site" button is clicked
        setIsFloatingInputOpen(true);
      };
    
      const closeFloatingInput = () => {
        // Close the floating input and clear input value
        setIsFloatingInputOpen(false);
        setInputValue("");
      };
    
      const handleInputConfirm = (value) => {
        // Handle the input data (e.g., send it to the server)
        console.log("Input Value:", value);
        closeFloatingInput();
      };

    //addsite

      const addsite = () => {
        // Open the floating input when the "Add Site" button is clicked
        setisFloatingSite(true);
      };
    
      const closeFloatingSite = () => {
        // Close the floating input and clear input value
        setisFloatingSite(false);
        setinputsite("");
      };
    
      const handleSiteConfirm = (value) => {
        // Handle the input data (e.g., send it to the server)
        console.log("Input Value:", value);
        closeFloatingSite();
      };

      const deleteclient = async () => {
        const instance = axios.create({ baseURL: 'http://localhost:8000', withCredentials: true });
      
        try {
          const response = await instance.get('api/v2/site/owner/' + clientid);
          const siteData = response.data;
      
          // Set the values in a single batch to trigger state updates
          const siteIdsToDelete = [];
          const serverIdsToDelete = [];
          const serverCheckIdsToDelete = [];
      
          for (const site of siteData) {
            siteIdsToDelete.push(site._id);
      
            const serverResponse = await instance.get('api/v2/server/owner/' + site._id);
            const serverData = serverResponse.data;
      
            for (const server of serverData) {
              serverIdsToDelete.push(server._id);
      
              const serverCheckResponse = await instance.get('api/v2/servercheck/owner/' + server._id);
              const serverCheckData = serverCheckResponse.data[0];
      
              if (serverCheckData) {
                serverCheckIdsToDelete.push(serverCheckData._id);
              }
            }
          }
      
          setsiteToDelete(siteIdsToDelete);
          setserversToDelete(serverIdsToDelete);
          setserverscheckToDelete(serverCheckIdsToDelete);
      
          // Use Promise.all to perform deletions concurrently
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
      
          await Promise.all(
            siteIdsToDelete.map(async (siteId) => {
              await instance.delete('api/v2/site/' + siteId);
              console.log('SiteDeleted');
            })
          );

          await instance.delete('api/v2/company/' + clientid);
      
          // Navigate after all deletions are complete
          navigate('/clients');
        } catch (error) {
          console.log(error);
        }
      };
      

    return(
        
        <div > 

            <div className="searchBar ">
                <div className="searchbarcontainer">
                
                    <label className="clientsBar" ><h2>Clients</h2> </label>
                    <input type='text'></input>
                    <div className="logout" onClick={logout}>LogOut</div>
                </div>
            </div>

            <div className="clientsBody bigdiv" >

            <div className="clientsList">

            {Object.keys(clients).map((item, idx) => {
                return(
                    <div key={`div ${idx}`} className="clientWrapper"
                    onMouseEnter={()=>getClientDetails(clients[item]._id)}>
                        <span key={`span ${idx}`} className="clients">
                            {clients[item].company}
                        </span>
                    </div>
                )})}

                <div className="Addclientwrapper">
                    <div className="addclienbutton" onClick={()=>addclient()}>
                        <div>+</div>                        
                    </div>
                    <div>Add Client</div>
                </div>

                {isFloatingInputOpen && (
                    <FloatingInput
                    onClose={closeFloatingInput}
                    onConfirm={handleInputConfirm}
                    pleaserender={pleaserender}
                    setpleaserender={setpleaserender}
                    />
                     )}

            </div>  

            <div className="clientsDetails">
                {/* {
                    Object.keys(fileteredsites).map((item, idx) => {
                        return(
                            <div key={`div ${idx}`} className="siteswrapper">
                                {fileteredsites[item]._id}
                            </div>
                        )
                    })
                } */}
                <SiteCard fileteredsites={fileteredsites}/>   

                <div className="twobuttonswrapper">
                    <div className="Addclientwrapper">
                        <div className="addclienbutton" onClick={()=>addsite()}>
                            <div>+</div>                        
                        </div>
                        <div>Add Site</div>
                    </div>  
                
                {isFloatingSite && (
                    <FloatingInputSite
                    onClose={closeFloatingSite}
                    onConfirm={handleSiteConfirm}
                    pleaserender={pleaserender}
                    setpleaserender={setpleaserender}
                    owner={clients}
                    ownerid={clientid}
                    />
                     )}

                    <div className="Addclientwrapper">
                        <div className="removeclientbutton"
                        onClick={(e)=>deleteclient(e)}>
                            <div>+</div>                        
                        </div>
                        <div>Drop Client and all Sites</div>
                    </div>    
                </div>         
            </div>



            </div>
        </div>

        )
    }

export default ClientPage;