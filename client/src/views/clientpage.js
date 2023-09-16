import { useEffect, useState } from "react";
import axios from 'axios';
/* import 'bootstrap/dist/css/bootstrap.min.css'; */
/* import '../mystyle.css' */
import SiteCard from "../components/siteCard.component";
import { useNavigate } from "react-router-dom";
import FloatingInput from "../components/floatinginputclient.component";
import FloatingInputSite from "../components/floatinginputsite.component";
import Popup from 'reactjs-popup';
import {baseUrl} from '../config.js'

import PageTemplate from "../template/PageTemplate";
import AddClientModal from '../components/floatinginputclient.component.copy'; // Import the new modal component

import { GoTrash } from "react-icons/go";
import { Modal, Button } from 'react-bootstrap';

const ClientPage = (props) => {

    const {_id, email, role} = props.user
    const {user, setUser} = props

    const [clients, setclients] = useState('')
    const [sites, setsites] = useState('')
    const [fileteredsites, setfileteredsites] = useState('')
    const navigate =  useNavigate()
    const [pleaserender, setpleaserender] = useState(0)


    const [isFloatingInputOpen, setIsFloatingInputOpen] = useState(false); // State to control the visibility of the floating input
    
    const [isFloatingSite, setisFloatingSite] = useState(false); // State to control the visibility of the floating input
    
    const [clientid, setclientid] = useState('')


    const [clientsfiltered, setclientsfiltered] = useState('')

    const[barra,setBarra] = useState('')
    const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
    const [isAddSiteModalOpen, setIsAddSiteModalOpen] = useState(false);
    const [isDeleteClientModalOpen, setIsDeleteClientModalOpen] = useState(false);


    useEffect(()=>{
        const instance = axios.create({baseURL: baseUrl})
        instance.get('/api/v2/company',{ withCredentials: true})
        .then(response =>  {
          setclients(response.data)
          setclientsfiltered(response.data)
        })
    },[pleaserender])

   useEffect(()=>{
        const instance = axios.create({baseURL: baseUrl})
        instance.get('/api/v2/site',{ withCredentials: true})
        .then(response =>  setsites(response.data))
        .catch((error) => error)
    },[pleaserender])


    const getClientDetails = (props) => {
        /* console.log(props) */
        setclientid(props)
        
        if(sites){
        const filteredObjects = sites.filter(obj => obj.owner._id === props._id);
        /* console.log(filteredObjects) */
        // setclientid(props,()=>{setfileteredsites(filteredObjects)})
        console.log(props)
        setfileteredsites(filteredObjects)
        
        
        return('')}
        else{return('')}
    }




    const addclient = () => {
        // Open the floating input when the "Add Site" button is clicked
        /* setIsFloatingInputOpen(true); */
        setIsAddClientModalOpen(true);
      };
    
      const closeFloatingInput = () => {
        // Close the floating input and clear input value
        setIsFloatingInputOpen(false);
        /* setInputValue(""); */
      };
    
      const handleInputConfirm = (value) => {
        // Handle the input data (e.g., send it to the server)
        /* console.log("Input Value:", value); */
        closeFloatingInput();
      };

    //addsite

      const addsite = () => {
        // Open the floating input when the "Add Site" button is clicked
        setIsAddSiteModalOpen(true);
      };

      const deleteclientmodal = () => {

        setIsDeleteClientModalOpen(true);
        
      };
      const handleClose = () => {
        setIsDeleteClientModalOpen(false)
      }
      // console.log(isDeleteClientModalOpen,"isDeleteClientModalOpen");
    
      const closeFloatingSite = () => {
        // Close the floating input and clear input value
        setisFloatingSite(false);
        /* setinputsite(""); */
      };
    
      const handleSiteConfirm = (value) => {
        // Handle the input data (e.g., send it to the server)
        /* console.log("Input Value:", value); */
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
        const instance = axios.create({ baseURL: baseUrl, withCredentials: true });
        handleClose();
        try {
          const response = await instance.get('api/v2/site/owner/' + clientid._id);
          const siteData = response.data;
      
          // Set the values in a single batch to trigger state updates
          const siteIdsToDelete = [];
          const serverIdsToDelete = [];
          const serverCheckIdsToDelete = [];

          removeFromDomClient(clientid._id);
      
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
              /* console.log('checklistDeleted'); */
            })
          );
      
          await Promise.all(
            serverIdsToDelete.map(async (serverId) => {
              await instance.delete('api/v2/server/' + serverId);
              /* console.log('ServerDeleted'); */
            })
          );
      
          await Promise.all(
            siteIdsToDelete.map(async (siteId) => {
              await instance.delete('api/v2/site/' + siteId);
              /* console.log('SiteDeleted'); */
            })
          );

          await instance.delete('api/v2/company/' + clientid._id);
            
          // Navigate after all deletions are complete
          navigate('/clients');
        } catch (error) {
          /* console.log(error); */
        }
      };


      const filteredClients = (e) =>{
        const clientes_filtered = clients.filter(item=>{
          return item.company.includes(e.target.value) 
        })
        /* console.log(clientes_filtered) */
        setclientsfiltered(clientes_filtered) 
      }
      


    return(
        
        <div > 
<PageTemplate  title="Clients" isclient={true} filteredClients={filteredClients} user={user} setUser={setUser}>

          <div className='container d-flex mt-4'>
            <div className="container d-flex m-3 justify-content-center w-50 col-6" >
            
            <ul className="col-4 d-flex flex-column text-black bg-warning rounded-3 border border-dark nav nav-pills nav-fill gap-3 col-3 text-dark justify-content-center w-100">
            <h3 className="text-center mt-3 mb-0">Clientes</h3>
            {Object.keys(clientsfiltered).map((item, idx) => {
                return(
                 
                    <li className="nav-item">
                    <div key={`div ${idx}`} className="d-flex bg-secondary m-3 p-3 border border-3 border-dark rounded-3 text-white"
                    onMouseEnter={()=>getClientDetails(clientsfiltered[item])}>
                        <span key={`span ${idx}`} className="nav-item active">
                            {clientsfiltered[item].company}
                        </span>
                    </div>
                    </li>
                  
                )})}
                

{role === 'admin' ? (
      <div className="d-flex justify-content-center m-3 flex-column align-items-center">
        <div
          type="button"
          className="btn btn-dark w-50"
          onClick={addclient} // Call the addclient function
        >
          <div>Add Client</div>
        </div>
        <div> </div>
      </div>
    ) : null}

    {/* Render the Add Client modal */}
    <AddClientModal
      show={isAddClientModalOpen}
      onHide={() => setIsAddClientModalOpen(false)}
      onConfirm={handleInputConfirm}
      pleaserender={pleaserender}
      setpleaserender={setpleaserender}
    />

            </ul> 
            </div>
            
            <div className="container text-center m-3 w-75 col-6 ">
            {clientid ?

            <div className="bg-warning border border-dark rounded-3  col-8 p-1 text-center">
              <h3 className="text-center mt-3 mb-0">Sitios de {clientid.company}</h3>
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
                <div className="container d-flex m-3 justify-content-center">
                    <div className="d-flex justify-content-center m-3 flex-column align-items-center">
                        <div className="btn btn-dark rounded-circle" onClick={()=>addsite()}>
                            <div>+</div>                        
                        </div>
                        <div >Add Site</div>
                    </div>  
                
                {isAddSiteModalOpen && (
                    <FloatingInputSite
                    show={isAddSiteModalOpen}
                    onHide={() => setIsAddSiteModalOpen(false)}
                    handleonconfirm={handleonconfirm}
                    onClose={closeFloatingSite}
                    onConfirm={handleSiteConfirm}
                    pleaserender={pleaserender}
                    setpleaserender={setpleaserender}
                    owner={clients}
                    ownerid={clientid._id}
                    />
                     )}

                    <div className="d-flex justify-content-center m-3 flex-column align-items-center">
                        <div className="btn btn-danger rounded-circle"
                        onClick={deleteclientmodal}>
                            <div>{<GoTrash/>}</div>                        
                        </div>
                        <div>Drop Client and all Sites</div>
                    </div>
                    {isDeleteClientModalOpen && (
                    <Modal show={isDeleteClientModalOpen} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                      <Modal.Title>Drop Client and all Sites</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <p className="text-danger">Are you sure you want to Drop Client and all Sites</p>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleClose}>
                        Cancel
                      </Button>
                      <Button variant="danger" onClick={(e)=>deleteclient(e)}>
                        Delete
                      </Button>
                    </Modal.Footer>
                  </Modal>  
                  )}  
                </div>   
                ):null}

            </div>: null      }



            </div>
            </div>
            
            </PageTemplate>
        </div>

        )
    }

export default ClientPage;