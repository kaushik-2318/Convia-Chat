import React, { Suspense } from 'react'

const LoadingScreen = () => {
  return <div>Loading...</div>
}

export default function Loadable({ Component, ...props }) {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
}