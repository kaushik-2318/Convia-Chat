import React from 'react';
import Logo from '../../assets/logo.svg';

export default function AuthHeader() {
  return (
    <div className="flex flex-col items-center">
      <div className="logo-box-shadow mb-2 h-24 w-24">
        <img src={Logo} alt="Convia Chat Logo" />
      </div>
      <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">Convia</h1>
      <p className="text-center text-xl font-bold tracking-tight sm:text-2xl">
        Connect beyond <span className="gradient-text">boundaries.</span>
      </p>
    </div>
  );
}
