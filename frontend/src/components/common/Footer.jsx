import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-auto">
      <div className="max-w-7xl mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} StreamBox. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
