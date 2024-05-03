import React from "react";

const Transaction = () => {
  const cards = [
    { name: "Payment", path: "/transaction/payment" },
    { name: "Receipt", path: "/transaction/receipt" },
    { name: "Journal", path: "/transaction/journal" },
    { name: "Contra", path: "/transaction/contra" },
    { name: "Sales", path: "/transaction/sales" },
    { name: "Purchase", path: "/transaction/purchase" },
    { name: "Credit Note", path: "/transaction/credit-note" },
    { name: "Debit Note", path: "/transaction/debit-note" },
  ];

  return (
    <>
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 md:py-24 overflow-y-auto h-screen">
        <h1 className="text-3xl font-bold mb-6">Transaction</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
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

export default Transaction;
