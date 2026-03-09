import React, { useEffect, useRef, useState } from "react";

import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

interface DropdownProps {
  label: string;
  submenu: { path: string; label: string }[];
}

const Dropdown: React.FC<DropdownProps> = ({ label, submenu }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = window.setTimeout(() => {
      setIsOpen(false);
    }, 1); // Delay before closing
    setTimer(newTimer);
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div
  ref={dropdownRef}
  className="relative flex items-center self-center"
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
>
      {/* Dropdown Trigger */}
<div
  className={`cursor-pointer font-bold flex items-center text-center text-sm transition-all rounded-t-lg hover:bg-slate-50 ${
  isOpen ? "text-indigo" : "text-black"
} p-3`}
>
  {label}
  <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
</div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full w-48 bg-white shadow-lg rounded-md border border-gray-200">
          {submenu.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
