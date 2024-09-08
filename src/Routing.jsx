import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import Society from "./Pages/Societies/Society";
import Transaction from "./Pages/Transaction/Transaction";
import Member from "./Pages/Member/Member";
import Profile from "./Pages/Member/Profile";
import MemberList from "./Pages/Member/MemberList";
import Master from "./Pages/Master/Master";
import Ledger from "./Pages/Master/Ledger/Ledger";
import NewLedger from "./Pages/Master/Ledger/NewLedger";
import Group from "./Pages/Master/Group";
import Payment from "./Pages/Transaction/Payment";
import Receipt from "./Pages/Transaction/Receipt";
import Purchase from "./Pages/Transaction/Purchase";
import MaintainanceHead from "./Pages/Master/MaintainanceHead";
import Report from "./Pages/Report/Report";
import ViewBills from "./Pages/Report/BillsView";
import AllChargeMemberView from "./Pages/Report/AllChargeMemberView";
import LedgerView from "./Pages/Master/Ledger/LedgerView";
import GroupView from "./Pages/Master/GroupView";
import NewGroup from "./Pages/Master/NewGroup";
import GenerateBill from "./Pages/Societies/GenerateBill";
import UpdateLedger from "./Pages/Master/Ledger/UpdateLedger";
import UpdateGroup from "./Pages/Master/UpdateGroup";
import NewMaintenanceHead from "./Pages/Master/NewMaitenanceHead";
import ViewMaintenanceHead from "./Pages/Master/ViewMaintenanceHead";
import UpdateMHead from "./Pages/Master/UpdateMHead";
import SignUp from "./Pages/Authentication/SignUp/SignUp";
import ForgotPassword from "./Pages/Authentication/ForgotPassword";
import ResetPassword from "./Pages/Authentication/ResetPassword";
import { Logged } from "./App";
import MasterOutlet from "./Pages/Master/MasterOutlet";
import BillMaster from "./Pages/Master/BillMaster";
import MHeadList from "./Pages/Master/MHeadList";
import MultipleReceipt from "./Pages/Transaction/Receipt/MultipleReceipt";
import MultiplePayment from "./Pages/Transaction/Payment/MultiplePayment";
import UnitHead from "./Pages/Master/UnitHead";
import OpeningBalance from "./Pages/Transaction/OpeningBalance";
import LedgerMain from "./Pages/Master/Ledger/LedgerMain";
import AccLedger from "./Pages/Master/Ledger/AccLedgers";
import MemberTrasaction from "./Pages/Member/Transaction";
import TransactionView from "./Pages/Member/TransactionView";
import IndividualLedger from "./Pages/Member/IndividualLedger";
import BankAccLedger from "./Pages/Master/Ledger/BankAccLedger";
import CashAccLedger from "./Pages/Master/Ledger/CashAccLedger";
import AllLedgers from "./Pages/Report/AllLedgers";
import PrintBill from "./Pages/Report/PrintBill";
import Approval from "./Pages/Member/Approval";
import SocietyForm from "./Pages/Societies/Profile/Profile";

const router = createBrowserRouter([
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
  {
    path: "/",
    element: <Logged />,
    children: [
      {
        path: "society",
        element: <Society />,
      },
      {
        path: "transaction",
        element: <Transaction />,
      },
      {
        path: "member",
        element: <Member />,
      },
      {
        path: "/member/profile",
        element: <Profile />,
      },
      {
        path: "/member/approval",
        element: <Approval />,
      },
      {
        path: "/member/memTransactions",
        element: <MemberTrasaction />,
        children: [
          {
            path: "",
            element: <TransactionView />,
          },
          {
            path: "individualLedger",
            element: <IndividualLedger />,
          },
        ],
      },
      {
        path: "/member/member-list",
        element: <MemberList />,
      },

      {
        path: "/master",
        element: <MasterOutlet />,
        children: [
          {
            index: true,
            element: <Master />,
          },
          {
            path: "unit-head",
            element: <UnitHead />,
          },
          {
            path: "ledger/:ledgerId",
            element: <LedgerView />,
          },
          {
            path: "ledger",
            element: <LedgerMain />,
          },
          {
            path: "ledger/partyLedger",
            element: <Ledger />,
          },
          {
            path: "ledger/accLedger",
            element: <AccLedger />,
          },
          {
            path: "ledger/accLedger/bankAcLedger",
            element: <BankAccLedger />,
          },
          {
            path: "ledger/accLedger/cashAcLedger",
            element: <CashAccLedger />,
          },
          {
            path: "ledger/partyLedger/newledger",
            element: <NewLedger />,
          },
          {
            path: "ledger/updateLedger",
            element: <UpdateLedger />,
          },
          {
            path: "groups",
            element: <Group />,
          },
          {
            path: "groups/:groupId",
            element: <GroupView />,
          },
          {
            path: "groups/newgroup",
            element: <NewGroup />,
          },
          {
            path: "groups/updateGroup",
            element: <UpdateGroup />,
          },
          {
            path: "maintenance-head",
            element: <MaintainanceHead />,
          },
          {
            path: "maintenance-head/M-headList",
            element: <MHeadList />,
          },
          {
            path: "maintenance-head/M-headList/:headId",
            element: <ViewMaintenanceHead />,
          },
          {
            path: "maintenance-head/M-headList/updateMHead",
            element: <UpdateMHead />,
          },
          {
            path: "maintenance-head/new-maintenanceHead",
            element: <NewMaintenanceHead />,
          },
          {
            path: "bill-master",
            element: <BillMaster />,
          },
        ],
      },

      {
        path: "society/bills",
        element: <GenerateBill />,
      },
      {
        path: "society/profile",
        element: < SocietyForm/>,
      },

      {
        path: "transaction/payment",
        element: <MultiplePayment />,
      },
      {
        path: "transaction/opening-balance",
        element: <OpeningBalance />,
      },
      {
        path: "transaction/receipt",
        element: <MultipleReceipt />,
      },
      {
        path: "transaction/purchase",
        element: <Purchase />,
      },
      {
        path: "report",
        element: <Report />,
      },
      {
        path: "report/bills",
        element: <Report />,
      },
      {
        path: "report/printBill",
        element: <PrintBill />,
      },
      {
        path: "report/AllLedgers",
        element: <AllLedgers />,
      },
      {
        path: "report/bills-view",
        element: <ViewBills />,
      },
      {
        path: "report/charge-view",
        element: <AllChargeMemberView />,
      },
    ],
  },
]);

export default router;
