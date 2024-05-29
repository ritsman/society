import { useAuth } from "../../hooks/useAuth";
import { Outlet } from "react-router-dom";

export default function MasterOutlet() {
  const { userDetails } = useAuth();

  function Logged({ user, comp }) {
    if (user === "admin") {
      return <>{comp}</>;
    } else {
      return <h2 className="p-5 text-2xl font-bold">Access Denied </h2>;
    }
  }
  return <Logged user={userDetails.role} comp={<Outlet />} />;
}
