import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="w-16 h-16 border-t-4 border-b-4 border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
};

export default Spinner;