import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import _ from "lodash";

const UserForm = (props) => {
  // --------------------------------------------------
  // I) HOOKS AND VARIABLES
  // --------------------------------------------------

  // Destructuring props
  const { formType, setUser } = props;

  // State Hooks
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessages, setErrorMessages] = useState({});

  // React Route Hooks  -  Navigate
  const navigate = useNavigate();

  // --------------------------------------------------
  // II) HANDLERS AND AUXILIAR FUNCTIONS
  // --------------------------------------------------

  // i) Handlers

  const handleOnChangeUserFields = (e) => {
    let userCredentialsToUpdate = { ...userCredentials }; // Deep clone
    // let userCredentialsToUpdate = _.cloneDeep(userCredentials); // Same as above
    userCredentialsToUpdate = {
      ...userCredentialsToUpdate,
      [e.target.name]: e.target.value,
    };
    // console.log(userCredentialsToUpdate);
    setUserCredentials(userCredentialsToUpdate);
  };

  const handleOnSubmitRegistration = (e) => {
    e.preventDefault();
    if (formType === "register") {
      registerUser();
    } else {
      loginUser();
    }
  };

  // ii) API Functions
  const registerUser = async () => {
    try {
      // a) Send POST request to register user
      let res = await axios.post(
        "http://localhost:8000/user/register",
        userCredentials,
        // this will force the sending of the credentials / cookies so they can be updated
        //    XMLHttpRequest from a different domain cannot set cookie values for their own domain
        //    unless withCredentials is set to true before making the request
        { withCredentials: true }
      );

      // b) Reset userCredentials state
      setUserCredentials({
        email: "",
        password: "",
        confirmPassword: "",
      });
      // c) Login User
      loginUser();
    } catch (err) {
      console.log("Error: ", err.response.data);
      updateErrorMessages(err);
    }
  };

  const loginUser = async () => {
    try {
      let res = await axios.post(
        "http://localhost:8000/user/login",
        userCredentials,
        // this will force the sending of the credentials / cookies so they can be updated
        //    XMLHttpRequest from a different domain cannot set cookie values for their own domain
        //    unless withCredentials is set to true before making the request
        { withCredentials: true }
      );
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/clients");
    } catch (err) {
      console.log("Error: ", err);
      updateErrorMessages(err);
    }
  };

  // iii) Aux Functions
  const updateErrorMessages = (err) => {
    let errorMessagesToUpdate = {};
    if (formType === "register") {
      let errors = err.response.data.errors?.errors;
      errorMessagesToUpdate = _.mapValues(errors, (error) => error.message);
    } else {
      errorMessagesToUpdate = {login: "Invalid Login. Please try again."}
    }
    setErrorMessages(errorMessagesToUpdate);
  };

  // --------------------------------------------------
  // III) JSX
  // --------------------------------------------------
  return (
    <div >
      <h3 >
        {formType === "register" ? <span>Register</span> : <span>Login</span>}
      </h3>
      <form onSubmit={handleOnSubmitRegistration} >
        {/* II) Email Field */}
        <div >
          <label htmlFor="email" >
            Email:
          </label>
          <div >
            <input
              type="email"
              id="email"
              name="email"
              placeholder="john.doe@example.com"
              onChange={handleOnChangeUserFields}
              value={userCredentials?.email}
              
            />
            <div >
              {errorMessages?.email}
            </div>
          </div>
        </div>

        {/* III) Password Field */}
        <div >
          <label htmlFor="password" >
            Password:
          </label>
          <div className="col-sm-7">
            <input
              type="password"
              id="password"
              name="password"
              placeholder="********"
              onChange={handleOnChangeUserFields}
              value={userCredentials?.password}
              
            />
            <div >
              {errorMessages?.password}
            </div>
            <div >
              {errorMessages?.login}
            </div>
          </div>
        </div>

        {/* IV) Confirm Password Field */}
        {formType === "register" && (
          <div >
            <label
              htmlFor="confirmPassword"
              
            >
              Confirm Password:
            </label>
            <div >
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="********"
                onChange={handleOnChangeUserFields}
                value={userCredentials?.confirmPassword}
                
              />
              <div >
                {errorMessages?.confirmPassword}
              </div>
            </div>
          </div>
        )}

        {/* V) Submit Button */}
        <div >
          <button type="submit" >
            {formType === "register" ? (
              <span>Register</span>
            ) : (
              <span>Login</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
