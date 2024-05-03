import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "./Pages/Navbar/Navbar.jsx";
import { useNavigate } from "react-router-dom";

import "./App.css";
import Sidebar from "./Pages/SideBar/SideBar.jsx";

function App() {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  function handleItemClick(name) {
    console.log(name);
    setActiveItem(name);
    setVisible(true);
  }
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
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
