

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import config from "../../config";

const IndividualLedger = () => {
  const location = useLocation();
  const { member } = location.state || {};
   const [formData, setFormData] = useState({
     type: "",
     billDate: "",
     billDueDate: "",
   });
  const [indiMember, setIndiMember] = useState({});
  const [fetchedBillData, setFetchedBillData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [openingBal, setOpeningBal] = useState({});
  const [fetchedPaymentCollection, setPaymentCollection] = useState([]);
  const [finalArray , setFinalArray] = useState([]);


  useEffect(() => {
    setIndiMember(member);
  }, [member]);

useEffect(() => {
  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);
  setFormData((prevData) => ({
    ...prevData,
    billDate: formattedDate,
  }));
}, []);

   const formatDate = (date) => {
     const day = date.getDate().toString().padStart(2, "0");
     const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth is 0-indexed
     const year = date.getFullYear();
     return `${year}-${month}-${day}`;
   };


  const handleChange = (e) => {
  
    // name = "billDate" , value="2024-01-01"
        const { name, value } = e.target;
  
        //to restrict for date year
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  

  if (value === "" || regex.test(value)) {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

  }
}
 

  useEffect(() => {
    async function fetchOpeningBalance() {
      try {
        const response = await axios.get(
          `${config.API_URL}/api/transaction/getOpeningBalance`
        );
        let openBal = response.data.filter((e) => e.id === indiMember._id);
        console.log(openBal);
        let obj ={
          principal:openBal[0].principal,
          interest : openBal[0].interest,
          date : openBal[0].date
        }
        console.log(obj);
        setOpeningBal(obj);
      } catch (error) {
        console.log(error);
      }
    }
    if (indiMember._id) {
      fetchOpeningBalance();
    }
  }, [indiMember._id]);

useEffect(() => {
  fetch(`${config.API_URL}/api/society/getBillCollection`)
    .then((response) => response.json())
    .then((data) => {
      let obj = data.bills.find((ele) => ele.memberId === indiMember._id);
      console.log(obj);

      if (obj && obj.charges) {
        // Check if obj and obj.charges exist
        let arr = [];
        obj.charges.forEach((item) => {
          arr.push({
            date: item.date,
            particulars: item.BillNo,
            debit: item.totalWithoutInt,
            credit: 0,
          });
          arr.push({
            date: item.date,
            particulars: `${item.BillNo}-INTEREST`,
            debit: item.interest,
            credit: 0,
          });
        });
        setFetchedBillData(arr);
      } else {
        console.log("No charges available or member not found.");
      }
    })
    .catch((error) => console.error("Error in fetching Bills:", error));
}, [indiMember._id]);


   useEffect(()=>{

     let arr = [...fetchedBillData , ...fetchedPaymentCollection];

       const sortedFiltered = arr.sort(
         (a, b) => new Date(a.date) - new Date(b.date)
       );
       console.log(sortedFiltered)
       setFinalArray(sortedFiltered)


   },[fetchedBillData,fetchedPaymentCollection])
useEffect(() => {
  async function fetchPayment() {
    try {
      let res = await axios.get(
        `${config.API_URL}/api/transaction/getAllpaymentCollection`
      );
      let pay = res.data.payments.find(
        (ele) => ele.memberId === indiMember._id
      );
      console.log(pay);

      if (pay && pay.payments) {
        // Check if pay and pay.payments exist
        let arr = [];
        pay.payments.forEach((item) => {
          arr.push({
            date: item.date,
            particulars: item.narration,
            debit: 0,
            credit: item.totalAmountPaid,
          });
        });
        setPaymentCollection(arr);
      } else {
        console.log("No payments available or member not found.");
      }
    } catch (error) {
      console.log("Error in fetching payments:", error);
    }
  }
  fetchPayment();
}, [indiMember._id]);




     const calculateRunningBalance = (transactions) => {
       let balance = openingBal? Number(openingBal.principal)+Number(openingBal.interest) : 0;
       return transactions.map((transaction) => {
         if (transaction.debit !== 0) {
           balance += Number(transaction.debit);
         }
         if (transaction.credit !== 0) {
           balance -= Number(transaction.credit);
         }
         return { ...transaction, runningBalance: balance };
       });
     };


  

  return (
    <div className="">
      <div className="flex justify-between px-5 flex-wrap gap-5">
        <div className="flex items-center">
          <span className="font-semibold mr-2">Member name:</span>
          <span>{indiMember.name}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2">Flat No:</span>
          <span>{indiMember.flatNo}</span>
        </div>
      </div>
      {/* <div className="px-10">
        <label className="block mb-1 text-sm font-medium"> Date</label>
        <input
          type="date"
          name="billDate"
          value={formData.billDate}
          onChange={handleChange}
          className=" p-2 border rounded"
        />
      </div> */}

      <div className="mt-5">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Particulars
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Debit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Credit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr key="adf">
              <td className="px-6 border py-4 whitespace-nowrap text-sm">
                {openingBal ? openingBal.date : "-"}
              </td>

              <td className="border px-4 py-2 text-sm">
                OPENING PRINCIPAL B/F
              </td>
              <td className="border px-4 py-2">
                {" "}
                {openingBal ? Number(openingBal.principal).toFixed(2) : "0.00"}
              </td>
              <td className="border px-4 py-2">-</td>
              {/* <td className="border px-4 py-2 text-sm">
                {openingBal
                  ? (
                      Number(openingBal.principal) + Number(openingBal.interest)
                    ).toFixed(2)
                  : "0.00"}
              </td> */}
              <td className="border px-4 py-2 text-sm">
                {openingBal ? Number(openingBal.principal).toFixed(2) : "0.00"}
              </td>
            </tr>
            <tr key="ahf">
              <td className="px-6 border py-4 whitespace-nowrap text-sm">
                {openingBal ? openingBal.date : "-"}
              </td>

              <td className="border px-4 py-2 text-sm">OPENING INTEREST B/F</td>
              <td className="border px-4 py-2">
                {" "}
                {openingBal ? Number(openingBal.interest).toFixed(2) : "0.00"}
              </td>
              <td className="border px-4 py-2">-</td>
              {/* <td className="border px-4 py-2 text-sm">
                {openingBal
                  ? (
                      Number(openingBal.principal) + Number(openingBal.interest)
                    ).toFixed(2)
                  : "0.00"}
              </td> */}
              <td className="border px-4 py-2 text-sm">
                {openingBal ? (Number(openingBal.principal)+Number(openingBal.interest)).toFixed(2) : "0.00"}
              </td>
            </tr>

            {calculateRunningBalance(finalArray).map((transaction, index) => (
              <tr kay={index}>
                <td className="px-6 border py-4 whitespace-nowrap text-sm">
                  {transaction.date}
                </td>

                <td className="px-6 border py-4 whitespace-nowrap text-sm">
                  {transaction.particulars}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm">
                  {transaction.debit !== "0"
                    ? Number(transaction.debit).toFixed(2)
                    : "-"}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm">
                  {transaction.credit !== "0"
                    ? Number(transaction.credit).toFixed(2)
                    : "-"}
                </td>
                <td className="px-6 border py-4 whitespace-nowrap text-sm">
                  {transaction.runningBalance.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IndividualLedger;