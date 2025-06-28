import React from "react";

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black bg-opacity-60">
    <div className="text-red-400 text-2xl mb-2">Error</div>
    <span className="text-white">{message}</span>
  </div>
);

export default ErrorMessage;