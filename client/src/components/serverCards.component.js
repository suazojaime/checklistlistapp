import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"



const ServerCards = (props) => {
    const {servers} = props
    const navigate = useNavigate('')
 

    

    return(
        <div className="serverWrapper">
        {
            
            servers?
            Object.keys(servers).map((item, idx)=>{
                return(

                    <div key={`div0 ${idx}`} className="servercard"
                    onClick={() => navigate(`/site/server/${servers[item]._id}`, {state: servers[item]})}>

                    <div key={idx} className="ServerTitle">{servers[item].Application}</div>

                    </div>
                )
            })
            :''
        }
        </div>
    )
}

export default ServerCards;