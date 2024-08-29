"use client";

import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState, useEffect, useRef } from "react";

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);
  const [indicatorPosition, setIndicatorPosition] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const animationFrameRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(Date.now());

  const isWithinTimeRange = () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0); // 8 AM
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0); // 5 PM

    return now >= startOfDay && now <= endOfDay;
  };

  const calculateIndicatorPosition = () => {
    if (!isWithinTimeRange()) {
      return null;
    }

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0); // Start of the visible range
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0); // End of the visible range

    // Calculate total minutes in the visible time range
    const totalMinutesInDay = (endOfDay.getTime() - startOfDay.getTime()) / (1000 * 60);
    // Calculate minutes since the start of the visible range
    const minutesSinceStart = Math.max(0, (now.getTime() - startOfDay.getTime()) / (1000 * 60));

    // Calculate the percentage of the indicator's position
    let percentage = (minutesSinceStart / totalMinutesInDay) * 100;

    // Adjust this value based on observed discrepancy
    const adjustment = 2; // Increase or decrease to fine-tune
    percentage -= adjustment;

    // Ensure the percentage is within bounds
    return Math.min(100, Math.max(0, percentage));
  };

  const updateIndicatorPosition = () => {
    const now = Date.now();
    if (now - lastUpdateRef.current >= 1000) { // Update every second
      setIndicatorPosition(calculateIndicatorPosition());
      lastUpdateRef.current = now;
      setIsInitialized(true); // Mark as initialized
    }
    animationFrameRef.current = requestAnimationFrame(updateIndicatorPosition);
  };

  useEffect(() => {
    // Start updating the indicator position
    updateIndicatorPosition();

    // Cleanup on component unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  const shouldDisplayIndicator = isInitialized && isWithinTimeRange();

  return (
    <div style={{ position: "relative", height: "98%" }}>
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        views={["work_week", "day"]}
        view={view}
        style={{ height: "98%" }}
        onView={handleOnChangeView}
        min={new Date(2025, 1, 0, 8, 0, 0)}
        max={new Date(2025, 1, 0, 17, 0, 0)}
      />
      {shouldDisplayIndicator && (
        <div
          className="custom-current-time-indicator"
          style={{ top: `${indicatorPosition}%` }}
        >
          <span className="time-label">Now</span>
        </div>
      )}
    </div>
  );
};

export default BigCalendar;
