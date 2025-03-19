import React from "react";

type ProgressGridProps = {
  dateCreated: string;
  streakDates: string[];
  today: string;
  size: number;
  rounded: boolean;
  gap: number;
};

const ProgressGrid = ({
  dateCreated,
  streakDates,
  today,
  size,
  rounded,
  gap,
}: ProgressGridProps) => {
  // Normalize dates to midnight in local timezone
  const normalizeDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const startDate = new Date(dateCreated);
  const normalizedStreakDates = streakDates.map(normalizeDate);
  const normalizedToday = normalizeDate(today);

  // Generate an array of the last 90 days starting from dateCreated
  const daysArray = Array.from({ length: 90 }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  });

  return (
    <div
      className="grid grid-cols-10"
      style={{ gap: `${gap}rem`, width: `${size}px`, height: `${size}px` }}
    >
      {daysArray.map((day, index) => {
        return (
          <div
            key={index}
            className={`${rounded ? "rounded-md" : ""} 
            ${normalizedStreakDates.includes(day) ? "bg-green-400" : "bg-gray-300"}
            ${day === normalizedToday ? "border-2 border-blue-500" : ""}
            ${index < 21 ? "bg-gray-400" : ""}
            w-6 h-6 flex items-center justify-center`}
          >
            {index == 20 ? <p className="text-xs text-gray-300">21</p> : <></>}
            {index == 89 ? <p className="text-xs text-gray-400">91</p> : ""}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressGrid;
