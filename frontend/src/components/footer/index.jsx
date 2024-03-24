import React from "react";

const Footer = () => {
  return (
    <footer className="w-full">
      <div className="container p-4 sm:p-6 flex flex-col items-center justify-center gap-1">

        <p className="text-sm">
          Build by Sudhanshu & Soham. All rights reserved &copy; {new Date().getFullYear()}
        </p>

        
      </div>
    </footer>
  );
};

export default Footer;