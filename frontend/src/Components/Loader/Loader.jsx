import React from 'react';
import './Loader.css';  // Loader styles

const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader"></div>
      <h4 className="poppins-semibold">Building Output</h4>
    </div>
  );
};

export default Loader;
