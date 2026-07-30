import React from "react";
import Sidebar from "../components/layout/Sidebar";
import UserPanel from "../components/layout/UserPanel";
import { useSelector } from "react-redux";
import Chat from "../components/chat/Chat";
function Home() {
  const userinfo = useSelector((state) => state.authinfoSlice.userinfo);

  return (
    <div className="flex h-screen bg-[#313338]">
      {/* Left Side */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex flex-col flex-1  min-h-screen ">
        {/* Main Content */}
        <div className="flex-1  min-h-screen   ">
          <div className="borderrounded-2xl  bg-[#313338] border-white/50 rounded-2xl">
            <Chat />
          </div>
        </div>

        {/* Bottom User Panel */}
        <div className=" absolute bottom-2  left-[3vw] ">
          <UserPanel userinfo={userinfo} />
        </div>
      </div>
    </div>
  );
}

export default Home;
