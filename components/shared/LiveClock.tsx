import { useState, useEffect } from "react";

interface LiveClockProps {
  className?: string;
}

const LiveClock: React.FC<LiveClockProps> = ({ className }) => {
  const [time, setTime] = useState<Date>(new Date());
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Client-side only initialization
    setIsHydrated(true);
    
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Formatting options for 24-hour clock
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  };

  // Only render after hydration to avoid server-client mismatch
  if (!isHydrated) return null;

  return (
    <time 
      dateTime={time.toISOString()}
      className={`font-mono ${className}`}
    >
      {time.toLocaleTimeString(undefined, timeOptions)}
    </time>
  );
};

export default LiveClock;