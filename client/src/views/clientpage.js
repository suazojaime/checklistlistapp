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

    const deleteclient = ()=>{
        {/* <Popup position="right center">
            <div>Popup content here !!</div>
        </Popup> */}
        const instance = axios.create({baseURL: 'http://localhost:8000'})
        try{
            instance.delete('/api/v2/company/'+clientid,{ withCredentials: true})
            .then(response => console.log(response))
            window.location.reload();
        }
        catch(error){console.log(error)}
        
    }
    
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