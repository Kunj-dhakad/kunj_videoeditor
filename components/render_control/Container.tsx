import React from "react";

export const InputContainer: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="rounded-geist flex flex-col">
      {children}
    </div>
  );
};
