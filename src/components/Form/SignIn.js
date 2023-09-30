// https://codesandbox.io/s/delicate-bird-pfqwt7?file=/src/styles.css:0-4043

import React from "react";
import { ENDPOINTS, createAPIEndpoint } from '../index';
import { useNavigate } from 'react-router-dom';
import useStateContext from "../../hooks/useStateContext";

function SignInForm() {

  const [state, setState] = React.useState({
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
      .login(state)
      .then((res) => {
        if (res.data !== null) {
          const { Username } = res.data;
          setContext({ username: Username });
          navigate('/dashboard');
        } else {
          console.log(res.error);
        }
      });
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Sign in</h1>
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
        />
        <button>Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;
