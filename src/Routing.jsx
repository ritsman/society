import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import Society from "./Pages/Societies/Society";
import Transaction from "./Pages/Transaction/Transaction";
import Member from "./Pages/Member/Member";
import Profile from "./Pages/Member/Profile";
import MemberList from "./Pages/Member/MemberList";
import Master from "./Pages/Master/Master";
import Ledger from "./Pages/Master/Ledger";
import NewLedger from "./Pages/Master/NewLedger";
import Group from "./Pages/Master/Group";
import Bills from "./Pages/Societies/Bills";
import Payment from "./Pages/Transaction/Payment";
import Receipt from "./Pages/Transaction/Receipt";
import Purchase from "./Pages/Transaction/Purchase";
import MaintainanceHead from "./Pages/Master/MaintainanceHead";
import Report from "./Pages/Report/Report";
import ViewBills from "./Pages/Report/BillsView";
import AllChargeMemberView from "./Pages/Report/AllChargeMemberView";
import LedgerView from "./Pages/Master/LedgerView";
import GroupView from "./Pages/Master/GroupView";
import NewGroup from "./Pages/Master/NewGroup";
import GenerateBill from "./Pages/Societies/GenerateBill";
import UpdateLedger from "./Pages/Master/UpdateLedger";
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
            path: "ledger/:ledgerId",
            element: <LedgerView />,
          },
          {
            path: "ledger",
            element: <Ledger />,
          },
          {
            path: "ledger/newledger",
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
        path: "transaction/payment",
        element: <Payment />,
      },
      {
        path: "transaction/receipt",
        element: <Receipt />,
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
