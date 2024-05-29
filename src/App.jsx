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
    { title: "Maintenance Head", link: "/master/maintenance-head" },

    { title: "Ledger", link: "/master/ledger" },
    { title: "Groups", link: "/master/groups" },
    { title: "New Group", link: "/master/groups/newgroup" },
    { title: "Update Group", link: "/master/groups/updateGroup" },
    { title: "Master", link: "/master" },
    { title: "Member", link: "/member" },
    { title: "newLedger", link: "/master/ledger/newledger" },
    { title: "Update Ledger", link: "/master/ledger/updateLedger" },
    { title: "Society", link: "/society" },
    { title: "Bills", link: "/society/bills" },
    { title: "Profile", link: "/member/profile" },
    // { title: "Transactions", link: "/member/transactions" },
    { title: "Member List", link: "/member/member-list" },
    { title: "Maintainance Head", link: "/master/maintainance-head" },
    { title: "Transaction", link: "/transaction" },
    { title: "Payment", link: "/transaction/payment" },
    { title: "Receipt", link: "/transaction/receipt" },
    { title: "Purchase", link: "/transaction/purchase" },
    { title: "Purchase", link: "/transaction/purchase" },
    { title: "Report", link: "/report" },
    { title: "View Bills", link: "/report/bills-view" },
  ];

  return (
    <div className="w-screen">
      <ToastContainer />
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
