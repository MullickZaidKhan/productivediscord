import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import UserPanel from "../components/layout/UserPanel";
import { useSelector } from "react-redux";
import Chat from "../components/chat/Chat";
import Profile from "../components/Profile/Profile.jsx";
function Home() {
  const userinfo = useSelector((state) => state.authinfoSlice.userinfo);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#070707]">
      {/* Left Side */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex flex-col flex-1  min-h-screen ">
        {/* Main Content */}
        <div className="flex-1  min-h-screen   ">
          <div
            className="rounded-2xl bg-[#313338] bg-cover bg-center bg-no-repeat"
            // style={{ backgroundImage: "url('/images/image.png')" }}
            style={{
              backgroundImage:
                "url('https://i.pinimg.com/1200x/81/c1/79/81c1798f090c8090aefca4886ea768d2.jpg')",
            }}
          >
            <Chat />
          </div>
        </div>

        {/* Bottom User Panel */}
        <div className="absolute bottom-2 left-[3vw]">
          <UserPanel userinfo={userinfo} setIsOpen={setIsOpen} />
          <div className="absolute bottom-2 left-[3vw] ">
            {isOpen && <Profile userinfo={userinfo} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
