// src/components/Layout.jsx
import { ModeToggle } from "@/components/customerComponents/mode-toggle";
import Sidebar from "@/components/customerComponents/Sidebar";
import { Outlet } from "react-router-dom";
import { userIsLogged } from "../Auth/token-methods";

const Layout = () => {
  return (
    <div className="flex">
      {userIsLogged() && <Sidebar />}
      <ModeToggle />
      <div className="flex-1 p-4 ml-14">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
