import { useNavigate } from "react-router-dom"



const SiteCard = (props) => {
    const {fileteredsites} = props
    const navigate = useNavigate('')

    return(
        <div>
        {fileteredsites?
        
                Object.keys(fileteredsites).map((item, idx) => {
                    return(
                        <div key={`div ${idx}`} className="siteswrapper"
                        onClick={()=>navigate(`/site/${fileteredsites[item]._id}`, {state: fileteredsites[item] })}
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