import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom"

/* import CheckilistList from "../components/cehcklistslist.component"; */
import ChecklistDetails from "../components/checklistdetails.component";
import axios, { Axios } from "axios";

import PageTemplate from '../template/PageTemplate';

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
        <div>
            <PageTemplate  title={site.state.Application} isclient={false}>
            <div className='container'>
                <div className="mx-5 mt-5 text-center">
                    
                    <div><h1>{site.state.Application}</h1></div>
                {/*  <CheckilistList checklists={checklists} /> */}
                    <ChecklistDetails checklists={checklists} ServerCategory={site.state.Application}/>
                    
                </div>
                </div>
            </PageTemplate>
        </div>
    )

}

export default ServerView;