'use client';
import React from 'react';
import { initFirebase } from '../../firebase/firebaseApp';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  initFirebase();
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  const signIn = async () => {
    const result = await signInWithPopup(auth, provider);
  };

  const signOut = () => {
    router.push('/');
    auth.signOut();
  };

  return (
    <div className='header'>
      <a href='../../'>
        <div className='logo'>
          <img src='/images/pokemon.png' alt='Pokemon Logo' />
        </div>
      </a>

      {loading ? (
        <div>Loading</div>
      ) : user ? (
        <div className='display'>
          <div>Hello, {user.displayName.split(' ')[0]}</div>
          <button onClick={() => signOut()} className='signout'>
            Sign Out
          </button>
        </div>
      ) : (
        <button onClick={() => signIn()} className='signin'>
          Sign In
        </button>
      )}
    </div>
  );
}
