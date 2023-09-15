import { useLocation, useNavigate, useParams } from "react-router-dom";
import ServerCards from "../components/serverCards.component";
import FloatingServerInput from "../components/floatingserverinput.component";
import { useState,useEffect } from "react";
import axios from "axios";
import PageTemplate from '../template/PageTemplate';

import {Card, Modal, Button } from "react-bootstrap";

import { GoTrash } from "react-icons/go";

const SitePage = (props)=>{
    const n = useParams()
    const a = useLocation()
    const navigate = useNavigate()

    // console.log(props.user.role)

    const [serverscheckToDelete,setserverscheckToDelete ] = useState('')
    const [serversToDelete, setserversToDelete] = useState('')
    const [siteToDelete, setsiteToDelete ] = useState('')

    const [isAddServerModalOpen, setIsAddServerModalOpen] = useState(false);
    // console.log(isAddServerModalOpen, "isAddServerModalOpen")
    const [isDeleteSiteModalOpen, setIsDeleteSiteModalOpen] = useState(false);

    const [servers, setservers] = useState("")
 
    const addserver = () => {
      // Open the floating input when the "Add Site" button is clicked
      setIsAddServerModalOpen(true);

    };

    useEffect(()=>{
        const instance = axios.create({baseURL: 'http://localhost:8000'})
        instance.get('/api/v2/server/owner/'+sitedata._id,{ withCredentials: true})
        .then(response =>  setservers(response.data))
        console.log(servers)
    },[])

    /* console.log(n)
    console.log(a) */
    const sitedata = a.state

   /*  console.log(a.state.role) */

    const [FloatingServer, setFloatingServer] = useState('')
    const [inputserver, setinputserver] = useState('')

    
    
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
      const deletesitemodal = () => {

        setIsDeleteSiteModalOpen(true);
        
      };

      const handleClose = () => {
        setIsDeleteSiteModalOpen(false)
      }
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
          <div className='container'>
        <div className="container m-5 text-center">
            <div className="container d-flex mt-5 justify-content-center gap-5">
                <div className="d-flex justify-content-center flex-column align-items-center col-3 me-5">
                    <div className="btn btn-dark rounded-5 d-flex justify-content-center fs-1 px-4 py-0" onClick={addserver}>+</div>
                    <div>Add server</div>
                </div>


                {props.user.role==='admin'?(

                <div className="d-flex justify-content-center flex-column align-items-center col-3 ms-5">
                    <div className="btn btn-danger rounded-5 d-flex justify-content-center fs-3 px-4 py-3" onClick={deletesitemodal}>{<GoTrash/>}</div>
                    <div>Remove site</div>
                
                
                {isDeleteSiteModalOpen && (
                  <Modal show={isDeleteSiteModalOpen} onHide={handleClose} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Remove site</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <p className="text-danger">Are you sure you want to Remove site and Servers</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Cancel
                    </Button>
                    <Button variant="danger" onClick={()=>deletesite()}>
                      Delete
                    </Button>
                  </Modal.Footer>
                </Modal>  
                )}
                </div>
                ):null}
            </div>
            {isAddServerModalOpen && (
            <FloatingServerInput
            show={isAddServerModalOpen}
            onHide={() => setIsAddServerModalOpen(false)}
            handleonconfirm={handleonconfirm}
            onClose={closeFloatingServer}
            onConfirm={handleServer}
            owner={n}
            />
            )}
            <Card className="w-100  mt-5 p-5 border-dark rounded-3 bg-warning fs-3">
              <Card.Body>
                <Card.Title className="fs-1">Summary</Card.Title>
                <Card.Text className="fs-3">{sitedata.summary}</Card.Text>
              </Card.Body>
            </Card>
            <div className="container text-center mt-5">
              <h1>Servers</h1>
              <hr className="border border-3 border-dark opacity-100" />
            </div>
            <ServerCards  servers={servers}/>
        </div>
        </div>
        </PageTemplate>
        </div>
    )
}

export default SitePage;