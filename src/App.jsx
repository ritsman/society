import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./Pages/Navbar/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "./App.css";
import Sidebar from "./Pages/SideBar/SideBar.jsx";
import Breadcrumbs from "./components/BreadCrumps.jsx";
import { useAuth } from "./hooks/useAuth.js";
import LoginPage, { getCurrentUser } from "./Pages/Authentication/Login/Login";

function App() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  function handleItemClick(name) {
    console.log(name);
    setActiveItem(name);
    // setVisible(true);
  }

  let paths = [
    { title: "Home", link: "/" },
    { title: "Master", link: "/master" },
    { title: "Bills Head", link: "/master/maintenance-head" },
    { title: "New head", link: "master/maintenance-head/new-maintenanceHead" },

    { title: "M Head List", link: "/master/maintenance-head/M-headList" },
    { title: "Bills Head", link: "/master/maintenance-head" },
    { title: "Bill Master", link: "/master/bill-master" },
    { title: "Ledger", link: "/master/ledger" },
    { title: "Party Ledger", link: "/master/ledger/partyLedger" },
    { title: "Groups", link: "/master/groups" },
    { title: "New Group", link: "/master/groups/newgroup" },
    { title: "Update Group", link: "/master/groups/updateGroup" },
    { title: "Master", link: "/master" },
    { title: "Member", link: "/member" },
    { title: "Member transaction", link: "/member/memTransactions" },
    { title: "Ind Ledger", link: "/member/memTransactions/individualLedger" },
    { title: "newLedger", link: "/master/ledger/newledger" },
    { title: "Account Ledger", link: "/master/ledger/accLedger" },
    { title: "Update Ledger", link: "/master/ledger/updateLedger" },
    { title: "Society", link: "/society" },
    { title: "Bills", link: "/society/bills" },
    { title: "Profile", link: "/member/profile" },
    // { title: "Transactions", link: "/member/transactions" },
    { title: "Member List", link: "/member/member-list" },
    { title: "Transactions", link: "/transaction" },
    { title: "Payment", link: "/transaction/payment" },
    { title: "Receipt", link: "/transaction/receipt" },
    { title: "Purchase", link: "/transaction/purchase" },
    { title: "Purchase", link: "/transaction/purchase" },
    { title: "Report", link: "/report" },
    { title: "View Bills", link: "/report/bills-view" },
  ];

  return (
    <div className="w-screen">
      <NavBar
        activeItem={activeItem}
        setVisible={setVisible}
        visible={visible}
        handleItemClick={handleItemClick}
      />
      <div className="flex w-screen  ">
        <div className="w-[0px] ">
          <Sidebar
            visible={visible}
            setVisible={setVisible}
            activeItem={activeItem}
          />
        </div>
        <div className="w-screen flex justify-end ">
          <div className={`${visible ? "w-[80%]" : "w-screen"}  `}>
            <Breadcrumbs paths={paths} />

            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

export const Logged = () => {
  const { isAuthenticated } = useAuth();
  let logged = getCurrentUser();

  return <>{logged ? <App /> : <LoginPage />}</>;
};
