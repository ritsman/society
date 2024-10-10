import { Outlet } from "react-router-dom";

const MemberTrasaction = () => {
  return (
    <div>
      <h1 className="text-center text-2xl font-semibold mb-5">
        Member Ledgers
      </h1>
      <Outlet />
    </div>
  );
};

export default MemberTrasaction;
