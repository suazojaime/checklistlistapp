import React from 'react'
import UserForm from '../components/UserForm.component'
import bannerImage from '../images/banner_bg.jpg'; 

const LogRegPage = (props) => {

  // --------------------------------------------------
  // I) HOOKS AND VARIABLES
  // --------------------------------------------------

  // i) Lifting States
  const { setUser } = props

  // --------------------------------------------------
  // II) JSX
  // --------------------------------------------------
  return (
    <div >

        <div className='logregbanner'>
            <h1>Welcome to the future of checklists</h1>

        </div>
     
     <div className="bigdiv">
        <div className = "logreqwrapper">
            <div className = "register">
            <UserForm formType={"register"} setUser={setUser} />
            </div>
            <div className = "login">
            <UserForm formType={"login"} setUser={setUser} />
            </div>
        </div>
    </div>

    </div>
  )
}

export default LogRegPage
