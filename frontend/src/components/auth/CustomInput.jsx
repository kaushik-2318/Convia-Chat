import React from 'react';

export default function CustomInput({ register, type = 'text', errors, name, label, icon: Icon }) {
  return (
    <div className="relative w-full">
      <input
        {...register(name)}
        type={type}
        id={name}
        className="peer w-full border-b bg-transparent py-2 pl-10 placeholder-transparent transition-all duration-300 outline-none focus:pr-10 focus:pl-2 [:not(:placeholder-shown)]:pr-10 [:not(:placeholder-shown)]:pl-2"
        placeholder=" "
      />
      <label
        htmlFor={name}
        className="pointer-events-none absolute top-1/2 left-10 -translate-y-1/2 cursor-text text-sm transition-all duration-300 peer-focus:-top-1 peer-focus:left-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:-top-1 peer-[:not(:placeholder-shown)]:left-0 peer-[:not(:placeholder-shown)]:text-xs sm:text-lg"
      >
        {label}
      </label>
      <Icon className="pointer-events-none absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transition-all duration-500 peer-focus:left-[calc(100%-28px)] peer-[:not(:placeholder-shown)]:left-[calc(100%-28px)]" />

      {errors[name] && (
        <span className="absolute right-2 -bottom-5 text-xs text-red-500 italic">
          {errors[name].message}
        </span>
      )}
    </div>
  );
}
