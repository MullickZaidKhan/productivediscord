import React from "react";
import Sidebar from "../components/layout/Sidebar";
import UserPanel from "../components/layout/UserPanel";
import { useSelector } from "react-redux";

function Home() {
  const userinfo = useSelector(
    (state) => state.authinfoSlice.userinfo
  );

  return (
    <div className="flex h-screen bg-[#313338]">
      {/* Left Side */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex flex-col flex-1">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <h1 className="text-white text-3xl font-bold">
            Welcome!
          </h1>
        </div>

        {/* Bottom User Panel */}
        <UserPanel userinfo={userinfo} />
      </div>
    </div>
  );
}

export default Home;