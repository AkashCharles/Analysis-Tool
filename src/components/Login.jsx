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
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isConnected) {
    return (
      <div>
        Hello {user.displayName}{' '}
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log out
        </button>
      </div>
    );
  } else {
    return <button
          className="btn btn-outline-success"
          id="login"
          onClick={() => connectWithPopup({ accessId: "rIOaoDFI8TRxHFwRPXrm" })}
        >
        Log in
      </button>;
  }
}

export default Login;

