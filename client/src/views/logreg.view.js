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
      
      <div className="container m-5 d-flex justify-content-center">
          <div className = "d-flex w-75">
              <div className = "col-6">
              <UserForm formType={"register"} setUser={setUser} />
              </div>
              <div className = " col-6">
              <UserForm formType={"login"} setUser={setUser} />
              </div>
          </div>
      </div>
    </PageTemplate>
    </div>
  )
}

export default LogRegPage