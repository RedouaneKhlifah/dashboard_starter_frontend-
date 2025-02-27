import { useState, useEffect } from "react";

const LiveClock: React.FC = () => {
  const [dateTime, setDateTime] = useState<Date>(new Date()); // Initialize with current date-time
  const [isHydrated, setIsHydrated] = useState(false); // Track hydration

  useEffect(() => {
    // This runs only after the component is mounted (client-side)
    setIsHydrated(true); // Hydration is complete
    const interval = setInterval(() => {
      setDateTime(new Date()); // Update time every second
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  // Use a consistent locale for both server and client
  const locale = "en-US"; // You can use "en-GB" or your preferred locale

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // Use 12-hour format (AM/PM)
  };

  return (
    <div className="space-y-1 text-center">
      <p className="text-lg font-semibold">
        {dateTime.toLocaleDateString(locale)}{" "}
        {/* This will display the initial date */}
      </p>
      <p
        className="text-lg font-bold font-mono w-[140px] mx-auto"
        style={{ display: "inline-block", textAlign: "center" }}
      >
        {dateTime.toLocaleTimeString(locale, timeOptions).toUpperCase()}
      </p>
    </div>
  );
};

export default LiveClock;
