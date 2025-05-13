import React from "react";

const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-lg transition duration-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
