import React from "react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            StreamBox
          </h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl">
            Share your videos with the world. Create, upload, and discover
            amazing content.
          </p>
          <div className="mt-4">
            <button className="bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-lg font-medium shadow-lg transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
