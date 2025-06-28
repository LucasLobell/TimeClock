import React, { useEffect, useState } from "react";

const dots = "...";

const Loading = () => {
  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(false);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    let i = 0;
    let typingInterval: NodeJS.Timeout;

    typingInterval = setInterval(() => {
      setDisplayed(dots.slice(0, i + 1));
      i++;
      if (i === dots.length) {
        clearInterval(typingInterval);
        setTypingDone(true);
      }
    }, 200);

    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    let cursorInterval: NodeJS.Timeout;
    if (typingDone) {
      setShowCursor(true); // Show cursor immediately after typing
      cursorInterval = setInterval(() => {
        setShowCursor((prev) => !prev);
      }, 400);
    }
    return () => clearInterval(cursorInterval);
  }, [typingDone]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-60">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-400 mb-4"></div>
      <span className="text-white text-lg">
        Loading{displayed}
        {typingDone && (
          <span style={{ opacity: showCursor ? 1 : 0 }}>|</span>
        )}
      </span>
    </div>
  );
};

export default Loading;