import React from "react";

type ProgressGridProps = {
  dateCreated: string;
  streakDates: string[];
  size: number;
  rounded: boolean;
  gap: number;
};

const ProgressGrid = ({ dateCreated, streakDates, size, rounded, gap }: ProgressGridProps) => {
  const createdDate = new Date(dateCreated);
  createdDate.setHours(0, 0, 0, 0); // Normalize to midnight UTC

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight UTC

  // Generate an array of the last 90 days
  const daysArray = Array.from({ length: 90 }, (_, i) => {
    const date = new Date(createdDate);
    date.setDate(createdDate.getDate() + i + 1);
    return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  });

  return (
    <div className="grid grid-cols-10" style={{ gap: `${gap}rem`, width: `${size}px`, height: `${size}px` }}>
      {daysArray.map((day, index) => (
        <div
          key={index}
          className={`${rounded ? "rounded-md" : ""} ${
            streakDates.includes(day) ? "bg-green-400" : "bg-gray-300"
          } w-6 h-6`}
        ></div>
      ))}
    </div>
  );
};

export default ProgressGrid;
