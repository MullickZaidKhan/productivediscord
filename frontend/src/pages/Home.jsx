import React, { useState, useRef, useEffect } from "react";
import {
  AnimatePresence,
  motion,
  Sidebar,
  UserPanel,
  useSelector,
  Chat,
  Profile,
  scaleIn,
  useGetUserBackground,
  DiscordAccountSettings,
} from "./home page import/homeimport.js";

function Home() {
  const userinfo = useSelector((state) => state.authinfoSlice.userinfo);
  const [isOpen, setIsOpen] = useState(false);
  // const [showAccountSettings, setShowAccountSettings] = useState(false); // control visibility
  const showAccountSettings = useSelector((state)=>state.AccountSettings.showAccountSettings)
  console.log(showAccountSettings)
  const { data, isLoading } = useGetUserBackground();

  const backgrounds = data?.data || [];
  const bgimg = backgrounds.imageUrl
    ? backgrounds.imageUrl
    : "https://i.pinimg.com/1200x/62/7e/3a/627e3aa8f4209d6cbcfcd831a30f935e.jpg";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#07070700]">
      {/* Left Side */}
      <Sidebar />

      {/* Right Side */}
      <div className="flex flex-col flex-1 min-w-0 min-h-0">
        {/* Main Content */}
        <div className="flex-1 min-h-0 p-0 sm:p-1.5">
          <div
            className="h-full w-full overflow-hidden rounded-none sm:rounded-[15px] bg-[#31333815] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${bgimg}')` }}
          >
            <Chat />
          </div>
        </div>

        {/* Bottom User Panel */}
        <div className="shrink-0 px-2 py-2 sm:px-3 absolute bottom-5 left-3">
          <UserPanel userinfo={userinfo} setIsOpen={setIsOpen} />
          <AnimatePresence>
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

      {/* Account Settings Modal Overlay */}
      {/* <AnimatePresence>
        {!showAccountSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className=" relative inset-0 z-0 w-full h-full flex items-center justify-center bg-zinc-600/60"
            onClick={() => setShowAccountSettings(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-full items-center justify-center p-4"
            >
              <div className="max-w-[95%] w-full max-h-[95%]">
                <Accountsettings  />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
        <AnimatePresence>
        {showAccountSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex h-full  items-center justify-center bg-black/60"
            onClick={() => setShowAccountSettings(false)} // click backdrop to close
          >
            <div className="max-w-[95%] w-full max-h-[95%]" onClick={(e) => e.stopPropagation()}>
              <DiscordAccountSettings />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
