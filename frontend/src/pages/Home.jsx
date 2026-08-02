import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../components/layout/Sidebar";
import UserPanel from "../components/layout/UserPanel";
import { useSelector } from "react-redux";
import Chat from "../components/chat/Chat";
import Profile from "../components/Profile/Profile.jsx";
import { scaleIn } from "../components/ui/motion.js";

function Home() {
  const userinfo = useSelector((state) => state.authinfoSlice.userinfo);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07070700]">
      {/* Left Side */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex flex-col flex-1 min-w-0 min-h-0 ">
        {/* Main Content */}
        <div className="flex-1 min-h-0 p-0 sm:p-1.5">
          <div
            className="h-full w-full overflow-hidden rounded-none sm:rounded-[15px] bg-[#31333815] bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://i.pinimg.com/1200x/81/c1/79/81c1798f090c8090aefca4886ea768d2.jpg')",
            }}
          >
            <Chat />
          </div>
        </div>

        {/* Bottom User Panel */}
        <div className="shrink-0 px-2 py-2 sm:px-3 absolute bottom-5 left-3 ">
          <UserPanel userinfo={userinfo} setIsOpen={setIsOpen} />
          <AnimatePresence className ="absolute ">
            {isOpen && (
              <motion.div
                variants={scaleIn}
                initial="hidden"
                animate="show"
                exit="hidden"
                style={{ transformOrigin: "bottom left" }}
              >
                <Profile className="absolute" userinfo={userinfo} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Home;
