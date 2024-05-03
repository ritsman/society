import React from "react";
import { NavLink } from "react-router-dom";

const NavBar = ({ activeItem, setVisible, visible, handleItemClick }) => {
  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Society", path: "/society" },
    { name: "Member", path: "/member" },
    { name: "Transaction", path: "/transaction" },
    { name: "Report", path: "/report" },
    { name: "Master", path: "/master" },
  ];
  return (
    <div className="">
      <nav className="bg-gray-800  fixed z-10 py-4 w-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-white font-bold text-xl">
                <img
                  src="https://cdn1.iconfinder.com/data/icons/user-interface-2311/24/menu_open_menu_menu_bar_three_lines_ui-512.png"
                  className="h-10 w-10 cursor-pointer"
                  onClick={() => setVisible(!visible)}
                />
              </span>
            </div>
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    ` ${isActive ? "bg-gray-400" : "bg-gray-700"}  rounded-md `
                  }
                >
                  <p
                    className=" text-white  hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                    onClick={() => handleItemClick(item.name.toLowerCase())}
                  >
                    {item.name}
                  </p>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
