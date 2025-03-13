import React from "react";

type ProgressGridProps = {
  streak: number;
};

const ProgressGrid = ({ streak }: ProgressGridProps) => {
  return (
    <div className="grid grid-cols-10 gap-1 p-4">
      {Array.from({ length: 90 }).map((_, index) => (
        <div
          key={index}
          className={`w-6 h-6 border rounded-sm ${index < streak ? "bg-green-400" : "bg-gray-300"}`}
        ></div>
      ))}
    </div>
  );
};

export default ProgressGrid;
