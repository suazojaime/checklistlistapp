import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"



const ServerCards = (props) => {
    const {servers} = props
    const navigate = useNavigate('')
 

    

    return(
        <div className="d-flex justify-content-around mt-5 gap-5">
        {
            
            servers?
            Object.keys(servers).map((item, idx)=>{
                return(

                    <div key={`div0 ${idx}`} className="d-flex flex-wrap bg-warning border rounded-3 p-5 align-items-center"
                    onClick={() => navigate(`/site/server/${servers[item]._id}`, {state: servers[item]})}>

                    <div key={idx} className="p-3 fs-3">{servers[item].Application}</div>

                    </div>
                )
            })
            :''
        }
        </div>
    )
}

export default ServerCards;