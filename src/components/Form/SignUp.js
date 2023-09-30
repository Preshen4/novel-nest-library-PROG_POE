// https://codesandbox.io/s/delicate-bird-pfqwt7?file=/src/styles.css:0-4043

import React from "react";
import { ENDPOINTS, createAPIEndpoint } from '../index';
import { useNavigate } from 'react-router-dom';
import useStateContext from "../../hooks/useStateContext";

function SignUpForm() {

     const [state, setState] = React.useState({
          username: "",
          email: "",
          password: ""
     });

     const handleChange = evt => {
          const value = evt.target.value;
          setState({
               ...state,
               [evt.target.name]: value
          });
     };

     const { setContext } = useStateContext();

     const navigate = useNavigate()

     const handleOnSubmit = evt => {
          evt.preventDefault();
          createAPIEndpoint(ENDPOINTS.users)
               .signup(state)
               .then((res) => {
                    console.log(res.data);
                    setContext({ userName: state.username });
                    navigate('/dashboard')
               })
               .catch((err) => {
                    console.log(err);
               });
     };

     return (
          <div className="form-container sign-up-container">
               <form onSubmit={handleOnSubmit}>
                    <h1>Create Account</h1>
                    <input
                         type="text"
                         name="username"
                         value={state.username}
                         onChange={handleChange}
                         placeholder="Username"
                    />
                    <input
                         type="email"
                         name="email"
                         value={state.email}
                         onChange={handleChange}
                         placeholder="Email"
                    />
                    <input
                         type="password"
                         name="password"
                         value={state.password}
                         onChange={handleChange}
                         placeholder="Password"
                    />
                    <button>Sign Up</button>
               </form>
          </div>
     );
}

export default SignUpForm;
