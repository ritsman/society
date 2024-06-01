import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import router from "./Routing";
import { RouterProvider } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastContainer />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
