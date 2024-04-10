import React from 'react';
import { useEarthoOne } from '@eartho/one-client-react';
import '../styles/Login.css'

function Login() {
  const {
    isConnected,
    user,
    connectWithPopup,
    logout,
  } = useEarthoOne();

  if (isConnected) {
    return (
      <div id="body">
        Hello {user.displayName}{' '}
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log out
        </button>
      </div>
    );
  } else {
    return(
      <div id="body">
         <button onClick={connectWithPopup}>Log in</button>
      </div>
    )
  }
}

export default Login;
