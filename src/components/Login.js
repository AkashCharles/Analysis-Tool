import React from 'react';
import { useEarthoOne } from '@eartho/one-client-react';
import '../styles/Login.css'

function Login() {
  const {
    isLoading,
    isConnected,
    error,
    user,
    connectWithPopup,
    logout,
  } = useEarthoOne();

  if (isLoading) {
    return <div>Loading…</div>;
  }
  if (error) {
    return <div>Oops… {error.message}</div>;
  }
  if (isConnected) {
    return (
      <div >
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
