import { useNavigate } from "react-router-dom"



const SiteCard = (props) => {
    const {fileteredsites} = props
    console.log('-----------')
    console.log(props.user.user.role)
    const role = props.user.user.role
    console.log('-----------')
    /* const {_id, email, role} = user */
    const navigate = useNavigate('')

    return(
        <div className="gap-3">
        {fileteredsites?
        
                Object.keys(fileteredsites).map((item, idx) => {
                    return(
                        <div key={`div ${idx}`} className="nav-link active"
                        onClick={()=>navigate(`/site/${fileteredsites[item]._id}`, {state: fileteredsites[item],role })}
                        >
                            <div key={`div2 ${idx}`}>{fileteredsites[item].siteName}</div>
                            <div key={`div3 ${idx}`}>{fileteredsites[item].products}</div>
                        </div>
                    )
                })
        
        :''}
        </div>
    )
}

export default SiteCard;