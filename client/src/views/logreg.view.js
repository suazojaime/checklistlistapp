import React from 'react'
import UserForm from '../components/UserForm.component'
import bannerImage from '../images/banner_bg.jpg'; 

import PageTemplate from '../template/PageTemplate';

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
      <PageTemplate  title="Welcome to the future of checklists" isclient={false}>
      
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
    </PageTemplate>
    </div>
  )
}

export default LogRegPage
