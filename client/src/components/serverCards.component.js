import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import Card from "react-bootstrap/Card";

const ServerCards = (props) => {
    const {servers} = props
    const navigate = useNavigate('')
 

    

    return(
        <div className="d-flex justify-content-around mt-5 gap-5">
        {
            
            servers?
            Object.keys(servers).map((item, idx)=>{
                return(
                    <Card
                    key={`div0 ${idx}`}
                    onClick={() => navigate(`/site/server/${servers[item]._id}`, {state: servers[item]})}
                    className="d-flex flex-wrap bg-warning border-dark rounded-3 p-5 align-items-center"
                        >
                        <Card.Body>
                            <Card.Text key={idx} className="p-3 fs-3">{servers[item].Application}</Card.Text>
                        </Card.Body>
                    </Card>
                )
            })
            :''
        }
        </div>
    )
}

export default ServerCards;