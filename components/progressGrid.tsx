import React from "react";

type ProgressGridProps = {
  streak: number;
  size: number;
  rounded: boolean;
  gap: number;
};

const ProgressGrid = ({ streak, size, rounded, gap }: ProgressGridProps) => {
  return (
    <div className="grid grid-cols-10" style={{ gap: `${gap}rem`, width: `${size}px`, height: `${size}px`}}>
      {Array.from({ length: 90 }).map((_, index) => (
        <div
          key={index}
          className={`${rounded ? "rounded-md" : ""} ${
            index < streak ? "bg-green-400" : "bg-gray-300"
          }`}
        ></div>
      ))}
    </div>
  );
};

export default ProgressGrid;
