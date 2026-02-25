import { Eye, EyeOff, Lock } from 'lucide-react';
import React, { useState } from 'react';

export default function CustomPassword({ register, errors }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleToggle = () => {
    setShowPassword((prev) => !prev);
    setTimeout(() => document.getElementById('password')?.focus(), 0);
  };

  return (
    <div className="relative w-full">
      <input
        {...register('password')}
        type={showPassword ? 'text' : 'password'}
        id="password"
        placeholder=" "
        className="peer w-full border-b bg-transparent py-2 pl-10 placeholder-transparent transition-all duration-300 outline-none focus:pr-10 focus:pl-2 [:not(:placeholder-shown)]:pr-10 [:not(:placeholder-shown)]:pl-2"
      />

      <label
        htmlFor="password"
        className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2 cursor-text text-sm transition-all duration-300 peer-focus:-top-1 peer-focus:left-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-top-1 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs sm:text-lg"
      >
        Password
      </label>

      <Lock className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 opacity-100 transition-all duration-500 peer-focus:left-[calc(100%-28px)] peer-focus:opacity-0 peer-[:not(:placeholder-shown)]:left-[calc(100%-28px)] peer-[:not(:placeholder-shown)]:opacity-0" />

      <button
        onMouseDown={(e) => e.preventDefault()}
        type="button"
        onClick={handleToggle}
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 rounded-full p-0 opacity-0 transition-all duration-500 peer-focus:pointer-events-auto peer-focus:left-[calc(100%-28px)] peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:pointer-events-auto peer-[:not(:placeholder-shown)]:left-[calc(100%-28px)] peer-[:not(:placeholder-shown)]:opacity-100"
      >
        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
      {errors.password && <span className="absolute right-2 -bottom-5 text-xs text-red-500 italic">{errors.password.message}</span>}
    </div>
  );
}
