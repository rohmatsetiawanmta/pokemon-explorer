'use client';
import React, { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div>
      <p>Error</p>
      <button onClick={() => reset()}>Ulangi Lagi</button>
    </div>
  );
}
