import React from "react";
import { NavLink } from "react-router-dom";

const LedgerMain = () => {
  const cards = [
    { name: "Account Ledger", path: "/master/ledger/accLedger" },
    { name: "Party Ledger", path: "/master/ledger/partyLedger" },
    { name: "Member Ledger", path: "/master/ledger/memberLedger" },
  ];

  return (
    <>
      <div
        className="max-w-7xl mx-auto sm:px-6 lg:px-8 md:py-16 overflow-y-auto "
        style={{ height: "calc(100vh - 150px)" }}
      >
        <h1 className="text-3xl font-bold mb-6">Ledger</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {cards.map((card) => (
            <NavLink
              key={card.name}
              to={card.path}
              className="bg-white shadow-md rounded-md p-4 hover:bg-gray-100 transition-colors duration-200"
            >
              <h2 className="text-lg font-semibold mb-2">{card.name}</h2>
              <p className="text-gray-600">Click to view {card.name}</p>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default LedgerMain;
