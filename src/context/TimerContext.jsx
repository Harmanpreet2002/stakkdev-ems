import { createContext, useEffect, useRef, useState } from "react";
import { punchAction } from "../services/apiService";
import { useSelector } from "react-redux";
import { useContext } from "react";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const storedTime = parseInt(localStorage.getItem("timer") || "0", 10);
  const [seconds, setSeconds] = useState(storedTime);
  const [showStandupPopup, setShowStandupPopup] = useState(false);

  const [isActive, setIsActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [stopTime, setStopTime] = useState(null);
  const timerRef = useRef(null);

  const { employee } = useSelector((state) => state.employee);
  const token = employee?.token?.accessToken;

  const WORK_HOURS = 8;

  const timer = (time) => {
    setStartTime(time);
    timerRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        const updatedSeconds = prevSeconds + 1;
        localStorage.setItem("timer", updatedSeconds.toString());
        return updatedSeconds;
      });
      localStorage.setItem("startTime", time.toString());
    }, 1000);
    console.log(timerRef.current);
  };

  useEffect(() => {
    const timerRunning = localStorage.getItem("timerRunning");
    const savedStartTime = parseInt(
      localStorage.getItem("startTime") || "0",
      10
    );
    const savedStopTime = parseInt(localStorage.getItem("stopTime") || "0", 10);

    if (timerRunning === "true") {
      setIsActive(true);
      // startTimer(savedStartTime);
      timer(savedStartTime);
      setStopTime(savedStopTime);
    } else {
      setStartTime(savedStartTime);
      setStopTime(savedStopTime);
    }
  }, []);

  const startTimer = (startTime) => {
    const currentStartTime = isActive ? startTime : Date.now();
    setStartTime(currentStartTime);
    timerRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        const updatedSeconds = prevSeconds + 1;
        localStorage.setItem("timer", updatedSeconds.toString());
        return updatedSeconds;
      });
      localStorage.setItem("startTime", currentStartTime.toString());
    }, 1000);
    console.log(timerRef.current);
    localStorage.setItem("timerRunning", "true");
  };

  const toggleTimer = async () => {
    try {
      if (!isActive) {
        await punchAction(token, "punch-in");
        startTimer(startTime || Date.now());
        if (stopTime) {
          setStopTime(null);
          localStorage.removeItem("stopTime");
          setSeconds(0);
          localStorage.removeItem("timer");
        }
      } else {
        await punchAction(token, "punch-out");
        clearInterval(timerRef.current);
        const currentTime = Date.now();
        setStopTime(currentTime);
        localStorage.setItem("stopTime", currentTime.toString());
        localStorage.removeItem("timerRunning");
        setShowStandupPopup(true);
      }
      setIsActive(!isActive);
    } catch (error) {
      console.error(
        `Error ${isActive ? "punching out" : "punching in"}:`,
        error
      );
    }
  };

  const calculateProgress = () => {
    const progress = (seconds / (WORK_HOURS * 3600)) * 100;
    return `${progress.toFixed(2)}%`;
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  const timerContextValue = {
    seconds,
    isActive,
    startTimer,
    toggleTimer,
    startTime,
    stopTime,
    calculateProgress,
    showStandupPopup,
    setShowStandupPopup
  };

  return (
    <TimerContext.Provider value={timerContextValue}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};
