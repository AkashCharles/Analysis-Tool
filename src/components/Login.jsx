import React, { useEffect } from 'react';
import { useEarthoOne } from '@eartho/one-client-react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import '../styles/Login.css';

function Login() {
  const {
    isLoading,
    isConnected,
    error,
    user,
    connectWithPopup,
    logout,
  } = useEarthoOne();

  const db = getFirestore();

  useEffect(() => {
    const saveDisplayName = async () => {
      if (isConnected && user && user.displayName) {
        try {
          // Check if user.userId is defined, use a default value if it's not available
          const userId = user.userId || 'unknown_user';
          const docRef = await addDoc(collection(db, 'users'), {
            displayName: user.displayName,
            userId: userId,
            // Add other user data you want to store here
          });
          console.log('Display name saved with ID: ', docRef.id);
        } catch (error) {
          console.error('Error adding document: ', error);
        }
      }
    };
  
    saveDisplayName();
  }, [db, isConnected, user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isConnected && user && user.displayName) { 
    return (
      

<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  <button class="button-cylinder" onClick={() => logout({ returnTo: window.location.origin })}>
    Log out
  </button>
  <span>Hello {user.displayName}</span>
</div>



    );
  } else {
    return (
      <button 
        className="btn btn-outline-success"
        id="login"
        onClick={() => connectWithPopup({ accessId: "rIOaoDFI8TRxHFwRPXrm" })}
      >
        Log in
      </button>
    );
  }
}

export default Login;
