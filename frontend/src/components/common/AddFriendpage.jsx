import React, { useState } from "react";
import {
  MessageCirclePlus,
  UsersRound,
  Menu,
  ChevronRight,
  Search,
  MessageSquare,
  MoreVertical,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useSendFriendRequest } from "../../hooks/useFriend.js";

const AddFriendpage = () => {
  const [sent, setSent] = useState(false);
  const [requestError, setRequestError] = useState(false);
  const [shake, setShake] = useState(false);
  const [username, setUsername] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const currentUser = useSelector((state) => state.authinfoSlice.userinfo);
  const sendFriendRequest = useSendFriendRequest();
  const currentUserId = currentUser?.id || currentUser?._id;
  console.log("Current User Info ->", currentUser);
  const handleSend = () => {
    if (!username.trim()) {
      setRequestError(true);
      setSent(false);

      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    if (!currentUserId) {
      setRequestError(true);
      setSent(false);

      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    setRequestError(false);

    sendFriendRequest.mutate(
      {
        senderId: currentUserId,
        receiverId: username.trim(),
      },
      {
        onSuccess: (response) => {
          setSent(true);
          setRequestError(false);
          setSuccessMessage(response?.data?.message || "Friend request sent");
        },

        onError: (error) => {
          setSent(false);
          setRequestError(true);

          setSuccessMessage(
            error?.response?.data?.message ||
              "User not found or friend request could not be sent.",
          );

          setShake(true);
          setTimeout(() => setShake(false), 400);
        },
      },
    );
  };

  const handleInputChange = (value) => {
    setUsername(value);

    if (sent || requestError) {
      setSent(false);
      setRequestError(false);
      setSuccessMessage("");
    }
  };
  return (
    <div>
      <div className=" w-full bg-[#31333813] flex items-start justify-center p-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="w-full max-w-2xl"
        >
          {/* Header row */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex items-start justify-between"
          >
            <div>
              <h1 className="text-white text-xl font-semibold">Add Friend</h1>
              <p className="text-[#b5bac1] text-sm mt-1">
                You can add friends with their Discord username.
              </p>
            </div>

            {/* Mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.15,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="relative shrink-0 -mt-2 animate-[float_3s_ease-in-out_infinite]"
            >
              {" "}
             
              <svg
                className="w-26 h-26 pb-4"
                viewBox="0 0 1297 1301"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1224.98 3.74188C1235.84 -1.41485 1237.2 -1.41552 1247.24 4.82684C1266.78 16.4974 1281.71 50.9664 1284.96 91.1345C1285.78 101.177 1289.03 122.075 1292.02 137.546C1296.63 160.615 1297.45 172.557 1296.36 201.326C1294.19 252.893 1284.96 284.919 1237.19 407.867C1234.48 414.652 1234.75 417.909 1239.91 429.037C1244.52 439.35 1246.69 441.792 1250.22 440.164C1252.67 439.078 1261.35 435.822 1269.49 432.837C1283.61 427.408 1284.15 427.408 1287.68 432.022C1297.72 446.135 1298.8 483.047 1289.58 511.002C1279.81 541.128 1266.51 553.884 1203.54 592.695C1097.15 658.647 1020.61 743.597 980.443 839.947C942.446 931.682 929.962 1021.79 938.918 1140.94C940.818 1163.46 941.361 1185.18 940.275 1188.98C937.019 1202 923.177 1213.95 893.322 1229.42C830.084 1262.26 767.117 1283.43 695.737 1295.91C656.655 1302.7 549.992 1302.7 508.467 1295.91C471.013 1289.67 423.516 1278 391.762 1266.87C319.839 1241.63 216.705 1179.75 206.662 1156.14C202.048 1144.74 202.862 1141.48 222.403 1107.55C266.1 1031.29 312.51 925.983 338.837 842.389L342.094 831.804L364.35 833.705C444.686 840.219 503.581 838.047 558.948 826.92C670.496 804.664 765.489 743.326 823.027 656.205C842.297 627.436 862.653 586.182 862.653 576.411C862.653 575.054 854.239 582.925 843.926 594.052C789.916 652.676 748.933 686.331 695.194 716.457C626.257 754.996 553.792 775.624 470.47 779.966C435.73 781.866 371.948 779.152 365.978 775.624C360.007 771.823 380.633 651.862 399.903 580.211C424.059 490.103 459.885 414.923 503.581 361.999C507.109 357.657 509.552 353.586 508.738 353.043C506.838 350.871 476.983 372.312 459.07 388.868C403.703 439.35 360.55 522.943 333.681 630.421C330.695 642.363 323.91 670.861 318.753 693.93C306.268 747.94 293.512 788.38 272.071 841.304C251.716 892.329 210.19 974.836 185.221 1014.46C175.45 1030.2 164.051 1048.12 160.251 1054.36C149.666 1071.46 132.839 1076.61 119.269 1066.84C109.226 1059.79 76.9287 1008.49 56.3018 966.966C29.704 912.684 4.46383 833.162 0.392578 790.28C-1.50727 768.296 2.29265 759.882 38.9326 709.129C55.217 686.602 73.6727 661.09 79.915 652.133C86.4288 643.177 106.513 615.765 124.697 591.067C142.881 566.369 160.25 542.485 162.965 537.871L168.122 529.186L144.781 501.231C110.313 459.163 94.028 435.55 75.8438 401.082C37.304 327.259 19.662 267.549 29.4326 242.58C32.4181 234.709 44.9033 227.381 55.2168 227.381C59.289 227.381 99.1854 234.166 144.238 242.58C260.672 264.021 343.18 275.148 360.55 272.163C372.763 269.72 381.72 265.106 438.715 230.909C565.733 154.644 673.482 110.676 744.319 106.062C776.617 104.162 806.472 107.962 863.467 121.803C932.947 138.631 937.833 137.817 1014.64 101.991C1063.49 78.9213 1158.49 34.6815 1186.98 21.3825C1203.54 13.7833 1220.64 5.91333 1224.98 3.74188ZM1243.17 227.381C1237.2 227.381 1225.52 237.694 1181.29 282.748C1102.03 362.813 1084.66 383.441 1068.92 416.009C1049.38 455.905 1037.98 493.359 1045.04 493.36C1055.35 493.089 1190.51 462.148 1200.55 457.534C1205.44 455.363 1208.15 451.021 1210.05 443.422C1213.04 430.665 1233.67 358.742 1245.61 318.302C1254.84 287.362 1259.18 243.395 1253.75 233.352C1251.58 229.553 1248.05 227.381 1243.17 227.381ZM887.079 202.683C887.079 201.326 885.451 200.511 883.822 200.783C881.922 200.783 875.951 201.598 870.795 202.14C858.581 203.226 815.428 210.282 789.373 215.439C756.804 221.953 742.691 227.653 705.236 249.908C675.381 267.821 607.802 321.016 611.059 324.273C613.23 326.173 667.782 317.217 706.051 308.532C760.604 296.047 780.417 288.719 804.301 272.706C828.184 256.422 887.076 206.757 887.079 202.683ZM376.022 53.9518C386.607 47.7095 400.45 50.6951 427.048 64.8083C457.989 80.8215 526.111 122.346 536.425 131.031L543.481 137.274L520.683 148.673C490.014 164.143 436.546 194.27 407.234 212.454C394.207 220.596 382.537 226.023 381.451 224.938C380.094 223.581 376.294 212.996 372.766 201.054C355.124 140.26 356.753 65.0803 376.022 53.9518Z"
                  fill="white"
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* Input row */}
          {/* <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`mt-4 flex items-center gap-3 bg-[#1e1f228e] rounded-2xl px-4 py-1.5 border ${sent ? "border-[#23a55a]" : "border-[#5865f25d]"} focus-within:border-[#5865F2] transition-colors ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
          >
            <input
              value={username}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Enter a username"
              className="flex-1 bg-transparent text-white placeholder-[#6d6f78] text-sm py-3 outline-none"
            />
            <motion.button
              onClick={handleSend}
              whileHover={{ scale: sent ? 1 : 1.03 }}
              whileTap={{ scale: 0.95 }}
              animate={sent ? { scale: [1, 1.06, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`shrink-0 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors duration-150 flex items-center gap-1.5 ${sent
                  ? "bg-[#23a55a]"
                  : requestError
                    ? "bg-[#ed4245] hover:bg-[#c73538]"
                    : "bg-[#5865F2] hover:bg-[#4752c4]"
                }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {sent ? (
                  <motion.span
                    key="sent"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    Friend Request Sent
                  </motion.span>
                ) : (
                  <motion.span
                    key="send"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                  >
                    Send Friend Request
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div> */}
          {/* Input row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div
              className={`flex items-center gap-3 bg-[#1e1f228e] rounded-2xl px-4 py-1.5 border ${
                sent
                  ? "border-[#23a55a]"
                  : requestError
                    ? "border-[#ed4245]"
                    : "border-[#5865f25d]"
              } focus-within:border-[#5865F2] transition-colors ${
                shake ? "animate-[shake_0.4s_ease-in-out]" : ""
              }`}
            >
              <input
                value={username}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Enter a username"
                className="flex-1 bg-transparent text-white placeholder-[#6d6f78] text-sm py-3 outline-none"
              />

              <motion.button
                onClick={handleSend}
                whileHover={{ scale: sent ? 1 : 1.03 }}
                whileTap={{ scale: 0.95 }}
                animate={sent ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`shrink-0 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors duration-150 flex items-center gap-1.5 ${
                  sent
                    ? "bg-[#23a55a]"
                    : requestError
                      ? "bg-[#ed4245] hover:bg-[#c73538]"
                      : "bg-[#5865F2] hover:bg-[#4752c4]"
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {sent ? (
                    <motion.span
                      key="sent"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-1.5"
                    >
                      <Check size={14} />
                      Friend Request Sent
                    </motion.span>
                  ) : requestError ? (
                    <motion.span
                      key="error"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                    >
                      Try Again
                    </motion.span>
                  ) : (
                    <motion.span
                      key="send"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.15 }}
                    >
                      Send Friend Request
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Success / Error message */}
            <AnimatePresence>
              {successMessage && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`mt-2 text-sm ${
                    requestError ? "text-[#ed4245]" : "text-[#23a55a]"
                  }`}
                >
                  {successMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
          <div className="h-px bg-[#3f4147] my-6" />

          {/* Other places section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <h2 className="text-white text-base font-semibold">
              Other Places to Make Friends
            </h2>
            <p className="text-[#b5bac1] text-sm mt-1 leading-relaxed">
              Don't have a username on hand? Check out our list of public
              servers that includes everything from gaming to cooking, music,
              anime and more.
            </p>

            <motion.button
              whileHover={{ y: -2, boxShadow: "0 6px 16px rgba(0,0,0,0.25)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="group mt-4 w-full max-w-sm flex items-center justify-between gap-3 bg-[#2b2d3173] hover:bg-[#2f3031cb] border border-[#3f4147] rounded-2xl px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#23a55a] flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M15.5 8.5L13 13L8.5 15.5L11 11L15.5 8.5Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <span className="text-white text-sm font-medium text-left">
                  Explore Discoverable Servers
                </span>
              </div>
              <ChevronRight
                size={18}
                className="text-[#b5bac1] group-hover:translate-x-0.5 transition-transform shrink-0"
              />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddFriendpage;
