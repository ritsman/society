import React, { useState } from "react";

function PayUForm() {
  const [paymentData, setPaymentData] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    email: "",
    phone: "",
    firstname: "",
    productInfo: "Membership", // Product info can still be fixed or dynamic
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Initiate payment process
  const initiatePayment = async (e) => {
    e.preventDefault(); // Prevent form reload on submit
    const response = await fetch("http://localhost:3001/api/society/pay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setPaymentData(data); // Store payment data for PayU submission form
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!paymentData && (
        <form
          onSubmit={initiatePayment}
          className="w-full max-w-lg p-6 bg-white shadow-md rounded-lg"
        >
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Enter Payment Details
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name:
            </label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Phone:
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Amount:
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onWheel={(e) => e.target.blur()} // Disable scroll for number input
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-300"
          >
            Pay with PayU
          </button>
        </form>
      )}

      {paymentData && (
        <form
          action="https://test.payu.in/_payment"
          method="POST"
          target="_blank"
          className="w-full max-w-lg p-6 bg-white shadow-md rounded-lg mt-6"
        >
          <input type="hidden" name="key" value={paymentData.key} />
          <input type="hidden" name="txnid" value={paymentData.txnid} />
          <input type="hidden" name="amount" value={paymentData.amount} />
          <input
            type="hidden"
            name="productinfo"
            value={paymentData.productinfo}
          />
          <input type="hidden" name="firstname" value={paymentData.firstname} />
          <input type="hidden" name="email" value={paymentData.email} />
          <input type="hidden" name="phone" value={paymentData.phone} />
          <input type="hidden" name="surl" value={paymentData.surl} />
          <input type="hidden" name="furl" value={paymentData.furl} />
          <input type="hidden" name="hash" value={paymentData.hash} />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300"
          >
            Proceed to PayU
          </button>
        </form>
      )}
    </div>
  );
}

export default PayUForm;
