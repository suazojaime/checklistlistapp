import { useEffect, useState } from "react";
import axios from 'axios';
/* import 'bootstrap/dist/css/bootstrap.min.css'; */
import '../mystyle.css'
import SiteCard from "../components/siteCard.component";
import { useNavigate } from "react-router-dom";
import FloatingInput from "../components/floatinginputclient.component";
import FloatingInputSite from "../components/floatinginputsite.component";
import Popup from 'reactjs-popup';


const ClientPage = (props) => {

    console.log(props)
    const {_id, email, role} = props.user
    console.log(role)

    const [clients, setclients] = useState('')
    const [sites, setsites] = useState('')
    const [fileteredsites, setfileteredsites] = useState('')
    const navigate =  useNavigate()
    const [pleaserender, setpleaserender] = useState(0)


    const [isFloatingInputOpen, setIsFloatingInputOpen] = useState(false); // State to control the visibility of the floating input
    
    const [isFloatingSite, setisFloatingSite] = useState(false); // State to control the visibility of the floating input
    
    const [clientid, setclientid] = useState('')


    const [clientsfiltered, setclientsfiltered] = useState('')


    useEffect(()=>{
        const instance = axios.create({baseURL: 'http://localhost:8000'})
        instance.get('/api/v2/company',{ withCredentials: true})
        .then(response =>  {
          setclients(response.data)
          setclientsfiltered(response.data)
        })
    },[pleaserender])

   useEffect(()=>{
        const instance = axios.create({baseURL: 'http://localhost:8000'})
        instance.get('/api/v2/site',{ withCredentials: true})
        .then(response =>  setsites(response.data))
        .catch((error) => console.log('error'))
    },[pleaserender])


    const getClientDetails = (props) => {
        /* console.log(props)
        console.log(sites[0])   */      
        
        if(sites){
        const filteredObjects = sites.filter(obj => obj.owner._id === props);
        console.log(filteredObjects)
        setclientid(props)
        setfileteredsites(filteredObjects)
        
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
        /* setInputValue(""); */
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
        /* setinputsite(""); */
      };
    
      const handleSiteConfirm = (value) => {
        // Handle the input data (e.g., send it to the server)
        console.log("Input Value:", value);
        closeFloatingSite();
      };

      const removeFromDomClient = clientid => {
        setclients(clients.filter(clients => clients._id !== clientid));
        setclientsfiltered(clientsfiltered.filter(clients => clients._id !== clientid));
        setclientid(null);
        }
        
        //to remove sites from dom
        const removeFromDomSites = sitesid => {
            setfileteredsites(fileteredsites.filter(fileteredsites => fileteredsites._id !== sitesid));
            setclientid(null);
            }

        const handleonconfirm=(newsite)=>{
          const newfileteredsites =[...fileteredsites];
          newfileteredsites.push(newsite);
          setfileteredsites(newfileteredsites);
          // console.log(fileteredsites, "fileteredsites")
        }


      const deleteclient = async () => {
        const instance = axios.create({ baseURL: 'http://localhost:8000', withCredentials: true });
      
        try {
          const response = await instance.get('api/v2/site/owner/' + clientid);
          const siteData = response.data;
      
          // Set the values in a single batch to trigger state updates
          const siteIdsToDelete = [];
          const serverIdsToDelete = [];
          const serverCheckIdsToDelete = [];

          removeFromDomClient(clientid);
      
          for (const site of siteData) {
            siteIdsToDelete.push(site._id);
      
            const serverResponse = await instance.get('api/v2/server/owner/' + site._id);
            const serverData = serverResponse.data;
            
            removeFromDomSites(site._id); //to remove sites from dom
      
            for (const server of serverData) {
              serverIdsToDelete.push(server._id);
      
              const serverCheckResponse = await instance.get('api/v2/servercheck/owner/' + server._id);
              const serverCheckData = serverCheckResponse.data[0];
      
              if (serverCheckData) {
                serverCheckIdsToDelete.push(serverCheckData._id);
              }
            }
          }
      
          /* setsiteToDelete(siteIdsToDelete);
          setserversToDelete(serverIdsToDelete);
          setserverscheckToDelete(serverCheckIdsToDelete); */
      
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


      const filteredClients = (e) =>{
        const clientes_filtered = clients.filter(item=>{
          return item.company.includes(e.target.value) 
        })
        console.log(clientes_filtered) 
        setclientsfiltered(clientes_filtered) 
      }
      


    return(
        
        <div > 

            <div className="searchBar ">
                <div className="searchbarcontainer">
                
                    <label className="clientsBar" ><h2>Clients</h2> </label>
                    <input type='text' onChange={(e) => filteredClients(e)}></input>
                    <div className="logout" onClick={logout}>LogOut</div>
                </div>
            </div>

            <div className="clientsBody bigdiv" >

            <div className="clientsList">

            {Object.keys(clientsfiltered).map((item, idx) => {
                return(
                    <div key={`div ${idx}`} className="clientWrapper"
                    onMouseEnter={()=>getClientDetails(clientsfiltered[item]._id)}>
                        <span key={`span ${idx}`} className="clients">
                            {clientsfiltered[item].company}
                        </span>
                    </div>
                )})}

                {role==='admin'?(
                <div className="Addclientwrapper">
                    <div className="addclienbutton" onClick={()=>addclient()}>
                        <div>+</div>                        
                    </div>
                    <div>Add Client</div>
                </div>
                ):null}

                {isFloatingInputOpen && (
                    <FloatingInput
                    onClose={closeFloatingInput}
                    onConfirm={handleInputConfirm}
                    pleaserender={pleaserender}
                    setpleaserender={setpleaserender}
                    />
                     )}

            </div>  
            {clientid ?
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
                <SiteCard fileteredsites={fileteredsites} user={props}/>   
                
                {role==='admin'?(
                <div className="twobuttonswrapper">
                    <div className="Addclientwrapper">
                        <div className="addclienbutton" onClick={()=>addsite()}>
                            <div>+</div>                        
                        </div>
                        <div>Add Site</div>
                    </div>  
                
                {isFloatingSite && (
                    <FloatingInputSite
                    handleonconfirm={handleonconfirm}
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
                ):null}

            </div>: null      }



            </div>
        </div>

        )
    }

export default ClientPage;