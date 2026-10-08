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
                viewBox="0 0 1247 1207"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1065.67 2.1394C1073.19 -0.535172 1084.56 -0.70189 1093.42 1.63843C1099.6 3.31009 1110.97 12.1699 1110.97 15.1794C1110.97 16.0168 1113.64 22.5362 1116.98 29.5564C1128.69 54.7992 1136.54 74.1913 1138.38 82.8845C1139.05 85.8933 1140.22 88.4006 1140.89 88.4011C1142.89 88.4011 1152.59 117.991 1155.26 132.368C1160.45 159.784 1160.28 174.998 1154.6 207.93C1149.41 237.353 1142.9 266.944 1138.38 282.658C1137.88 284.284 1137.41 285.619 1136.92 286.685C1114.54 266.97 1085.16 255.01 1053 255.01C982.856 255.01 925.996 311.869 925.996 382.01C925.996 395.973 928.252 409.409 932.415 421.975C926.329 436.87 917.045 456.806 906.495 469.826C885.668 495.529 838.282 520.969 838.242 520.991C838.242 520.991 907.436 525.929 939.904 514.491C954.986 509.178 970.027 498.635 982.723 487.808C1002.85 501.202 1027.01 509.01 1053 509.01C1114.79 509.01 1166.28 464.87 1177.65 406.398C1180.03 397.52 1181.28 387.591 1181.51 376.442C1181.84 356.382 1190.54 364.406 1205.25 398.008L1209.42 407.704L1215.78 405.363C1219.29 404.026 1224.64 401.685 1227.65 400.18C1233.16 397.339 1233.5 397.34 1236.5 400.348C1246.2 410.212 1250.38 466.883 1243.36 494.133C1234.5 528.738 1217.95 548.631 1166.97 586.58C1150.42 598.95 1131.53 613.16 1125.18 618.343C1118.66 623.358 1111.47 629.042 1108.96 630.881C1081.88 651.276 1030.4 700.425 1009.83 725.334C986.434 753.584 983.925 756.93 983.925 758.602C983.924 759.438 982.922 760.942 981.585 761.611C980.415 762.28 978.408 764.788 977.238 766.961C976.068 769.301 974.396 771.975 973.561 772.811C970.217 776.823 949.657 812.431 942.135 827.477C921.407 868.602 903.687 921.429 894.66 969.408C892.32 981.779 888.141 1009.2 885.467 1030.43C877.777 1090.44 876.556 1109.37 874.304 1124.31C873.898 1126.59 873.323 1131.09 872.991 1134.38C872.66 1137.67 871.868 1140.86 871.339 1141.46C870.81 1142.07 870.67 1142.63 871.13 1142.74C872.204 1142.98 868.017 1157.87 864.178 1167.22C857.313 1183.94 824.044 1192.2 812.536 1205.19C801.028 1218.17 774.091 1157.64 743.052 1134.52C682.295 1089.27 633.878 1086.93 559.906 1070.58C492.562 1055.7 384.361 1051.25 384.361 1051.25C384.427 1051.16 402.249 1026.6 400.092 1009.24C395.429 971.739 341.648 1025.08 304.055 1021.2C283.226 1019.04 251.845 1009.09 251.723 1009.05C251.848 1008.97 289.461 986.151 301.873 962.555C337.204 895.39 183.746 950.182 109.745 933.34C82.0314 927.032 49.8653 921.508 39.2461 915.259C27.4695 908.328 4.31966 898.673 4.24609 898.642C4.31894 898.616 40.7281 885.263 58.7461 869.142C72.7479 856.615 79.0594 846.227 88.2471 831.138C92.981 823.364 96.7472 821.638 101.747 812.138C106.747 802.638 114.747 789.257 114.747 789.257L119.203 781.338C119.277 781.241 128.791 768.874 144.276 745.395C151.797 733.862 158.65 723.665 159.32 722.827C160.156 721.824 161.327 719.985 161.828 718.48C162.497 716.808 166.676 709.62 171.356 702.097C176.036 694.744 179.88 688.225 179.882 687.72C179.88 686.383 169.684 681.702 165.171 680.866C148.789 677.856 95.632 649.27 74.0684 631.717C46.9885 609.817 21.0791 582.233 21.0791 575.379C21.0786 574.042 19.9083 572.704 18.5713 572.203C17.2342 571.534 16.5651 570.531 17.0664 569.695C17.5676 568.859 17.2339 568.19 16.5654 568.19C15.7296 568.19 13.8912 565.683 12.3867 562.674C11.0494 559.832 8.207 554.315 6.20117 550.47C4.19531 546.793 2.35694 541.275 1.85547 538.433C1.52115 535.592 0.852118 532.416 0.183594 531.413C-1.32 528.905 6.70304 522.218 13.8906 520.045C17.4011 519.042 31.6103 514.695 45.3174 510.515C59.1914 506.336 72.8982 502.157 75.7402 501.154C78.7489 500.151 82.0925 499.984 83.0957 500.652C84.2656 501.321 84.5999 501.154 84.0986 500.318C83.2643 498.813 92.1227 495.303 99.8115 493.966C102.152 493.631 129.065 485.439 148.121 479.254C154.139 477.415 160.658 475.576 162.664 475.409C164.67 475.075 167.01 474.406 168.013 473.904C170.356 472.399 230.358 454.514 233.038 454.512C234.208 454.512 236.382 453.843 238.054 453.008C239.559 452.004 245.744 449.832 251.761 447.993C272.321 441.808 296.058 434.786 305.586 432.111C310.768 430.607 317.287 427.597 319.962 425.257C322.636 423.084 325.31 421.747 325.979 422.248C326.648 422.916 326.816 422.415 326.314 421.078C325.65 418.567 365.933 380.619 403.041 349.025C413.237 340.5 422.43 332.477 423.769 331.138C426.109 328.798 434.635 322.277 457.201 305.393C476.257 291.184 501.832 273.965 504.006 273.965C505.009 273.965 505.845 273.129 505.845 272.126C505.845 271.29 506.681 270.956 507.517 271.457C508.519 271.958 509.187 271.791 509.188 271.123C509.19 269.617 521.393 262.261 539.444 252.566C559.838 241.7 594.774 228.994 621.186 223.143C642.248 218.295 671.334 216.959 707.775 218.965C726.497 219.968 750.568 220.469 761.267 220.302C783.165 219.633 786.173 218.462 806.065 202.581C811.749 198.234 827.797 185.529 841.838 174.496C855.879 163.463 868.248 153.432 869.586 152.261C870.756 151.258 872.261 150.256 873.097 150.256C873.765 150.256 876.775 148.083 879.449 145.575C883.799 141.56 944.474 92.9154 959.185 81.7146C962.194 79.374 972.224 71.5164 981.418 64.1609C1009.5 41.5929 1020.53 33.2342 1022.21 33.2341C1023.04 33.234 1024.04 32.5649 1024.38 31.8962C1024.71 31.2262 1028.22 28.0501 1032.4 24.8748C1036.41 21.6986 1041.76 17.3528 1044.1 15.1794C1049.95 9.82994 1058.48 4.64699 1065.67 2.1394ZM742.712 289.511C744.885 286.168 745.219 282.658 743.046 284.664C742.707 284.998 728.834 285.834 712.288 286.503C671.836 288.007 662.14 290.18 650.271 300.211C645.925 303.889 632.218 326.457 628.373 336.153C626.869 340.164 625.198 343.675 624.529 344.177C623.025 345.515 614.334 371.421 615.335 372.262C616.505 373.6 669.328 345.849 676.015 340.5C677.017 339.497 678.02 339.33 678.021 340.166C678.021 341.001 678.689 340.834 679.357 339.831C680.027 338.827 684.373 335.986 688.886 333.478C693.566 330.803 699.752 326.791 702.928 324.451C706.104 321.943 712.79 316.761 717.805 312.916C729.171 304.223 739.369 294.694 742.712 289.511Z"
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
