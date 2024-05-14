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
import MaintainanceHead from "./Pages/Master/MaintainanceHead";
import Bills from "./Pages/Societies/Bills";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
        element: <Master />,
      },
      {
        path: "/master/ledger",
        element: <Ledger />,
      },
      {
        path: "master/ledger/newledger",
        element: <NewLedger />,
      },
      {
        path: "master/groups",
        element: <Group />,
      },
      {
        path: "master/maintainance-head",
        element: <MaintainanceHead />,
      },
      {
        path: "society/bills",
        element: <Bills />,
      },
    ],
  },
]);

export default router;
