import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./Pages/Navbar/Navbar.jsx";
import { useNavigate } from "react-router-dom";

import "./App.css";
import Sidebar from "./Pages/SideBar/SideBar.jsx";
import Breadcrumbs from "./components/BreadCrumps.jsx";

function App() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  function handleItemClick(name) {
    console.log(name);
    setActiveItem(name);
    setVisible(true);
  }

  let paths = [
    { title: "Home", link: "/" },
    { title: "Master", link: "/master" },
    { title: "Ledger", link: "/master/ledger" },
    { title: "Groups", link: "/master/groups" },
    { title: "Master", link: "/master" },
    { title: "Member", link: "/member" },
    { title: "newLedger", link: "/master/ledger/newledger" },
    { title: "Society", link: "/society" },
    { title: "Bills", link: "/society/bills" },
    { title: "Profile", link: "/member/profile" },
    { title: "Transactions", link: "/member/transactions" },
    { title: "Member List", link: "/member/member-list" },
    { title: "Maintainance Head", link: "/master/maintainance-head" },
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
