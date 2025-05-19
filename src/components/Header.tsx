
import React from "react";

interface HeaderProps {
  title: string;
  actionButton?: React.ReactNode;
}

const Header = ({ title, actionButton }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {actionButton}
      </div>
    </header>
  );
};

export default Header;
