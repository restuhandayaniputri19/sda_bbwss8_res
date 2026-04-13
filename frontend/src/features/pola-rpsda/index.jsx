import { useState } from "react";
import Rpsda from "../rpsda";
import PolaPdf from "./PolaPdf";

const PolaRpsda = () => {
  const [activeTab, setActiveTab] = useState("pola");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Judul */}
      <div className="flex flex-col items-center mt-10 mb-6">
        <h1 className="text-3xl font-bold">Pola dan RPSDA</h1>
      </div>

      {/* Tab Toggle */}
      <div className="flex justify-center mb-8">
        <div className="flex border border-gray-300 rounded-lg overflow-hidden">
          {["pola", "rpsda"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-10 py-2.5 text-sm font-semibold tracking-wider transition-colors ${
                activeTab === tab
                  ? "bg-white text-indigo border-b-2 border-indigo"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "pola" ? <PolaPdf /> : <Rpsda hideBanner={true} />}
    </div>
  );
};

export default PolaRpsda;