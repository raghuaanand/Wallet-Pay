import React from "react";

export function Card({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}): JSX.Element {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-6">
        <h1 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">
          {title}
        </h1>
        <div className="text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
}
