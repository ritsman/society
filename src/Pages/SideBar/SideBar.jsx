import React from "react";
import { Link } from "react-router-dom";
import { MenuItems } from "../../Const/Const.jsx";

const Sidebar = ({ visible, activeItem }) => {
  function m(activeItem) {
    switch (activeItem) {
      case "society":
        return MenuItems.society;
      case "transaction":
        return MenuItems.transaction;
      case "dashboard":
        return MenuItems.dashboard;
      case "member":
        return MenuItems.member;
      case "master":
        return MenuItems.master;
      default:
        return MenuItems.dashboard;
    }
  }

  const menu_items = m(activeItem);

  return (
    <div
      className={`bg-gray-800 text-white h-screen overflow-auto   w-[250px]  ${
        visible
          ? "translate-x-0 transition-transform duration-300 ease-in-out"
          : "-translate-x-full transition-transform duration-300 ease-in-out"
      } h-[565px] flex flex-col`}
    >
      <div className="flex-1 ">
        <div className="px-4 py-20">
          <ul className="space-y-2  ">
            {menu_items.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className="block  py-2 px-4 rounded-md hover:bg-gray-700"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
