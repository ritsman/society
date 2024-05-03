import React from "react";

const Society = () => {
  const cards = [
    { name: "Forms", path: "/society/forms" },
    { name: "Buy Laws", path: "/society/buy-laws" },
    { name: "Circulas", path: "/society/circulas" },
    { name: "Nomination", path: "/society/nomination" },
    { name: "Profile", path: "/society/profile" },
    { name: "Committee Member", path: "/society/committee-member" },
    { name: "Bank Account", path: "/society/bank-account" },
    { name: "Bills", path: "/society/bills" },
    { name: "Balance Sheet", path: "/society/balance-sheet" },
    { name: "P&L", path: "/society/pl" },
    { name: "Assets", path: "/society/assets" },
    { name: "Liability", path: "/society/liability" },
    { name: "Parking Permits", path: "/society/parking-permits" },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 md:py-24 overflow-y-auto h-screen">
        <h1 className="text-3xl font-bold mb-6">Society</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {cards.map((card) => (
            <a
              key={card.name}
              href={card.path}
              className="bg-white shadow-md rounded-md p-4 hover:bg-gray-100 transition-colors duration-200"
            >
              <h2 className="text-lg font-semibold mb-2">{card.name}</h2>
              <p className="text-gray-600">Click to view {card.name}</p>
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Society;
