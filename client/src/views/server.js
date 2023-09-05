import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom"

/* import CheckilistList from "../components/cehcklistslist.component"; */
import ChecklistDetails from "../components/checklistdetails.component";
import axios, { Axios } from "axios";

const ServerView = (props) =>{
    const serverid = useParams()
    const site = useLocation()

    const [checklists, setchecklists] = useState('')
   
    useEffect(()=>{
        const instance = axios.create({baseURL: 'http://localhost:8000'})
        instance.get('/api/v2/servercheck/owner/'+serverid.id,{ withCredentials: true})
        .then(response =>  setchecklists(response.data))
    },[])

    return(
        <div className="bigdiv">
            <div><h1>{site.state.Application}</h1></div>
           {/*  <CheckilistList checklists={checklists} /> */}
            <ChecklistDetails checklists={checklists} ServerCategory={site.state.Application}/>
        </div>

    )

}

export default ServerView;