import React from "react";
import { FaDiscord, FaPlus, FaCompass } from "react-icons/fa";
import { Volume2 } from "lucide-react";
import { HiArrowDownTray } from "react-icons/hi2";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { staggerContainer, fadeInUp, tapScale } from "../ui/motion.js";

const servers = [
  {
    id: 1,
    image:
      "https://i.pinimg.com/736x/98/c9/c6/98c9c69a7816ad5107b06d654c733bd9.jpg",
  },
  {
    id: 2,
    image:
      "https://i.pinimg.com/736x/7e/b0/ad/7eb0ad3404f6a6325b6f67cb2708b9ca.jpg",
    badge: true,
  },
  {
    id: 3,
    image:
      "https://i.pinimg.com/1200x/52/f0/b2/52f0b21596c0e80fca993cdfb12f1fed.jpg",
  },
  {
    id: 4,
    image:
      "https://i.pinimg.com/736x/88/02/27/880227df5154f2c7365701592d36d306.jpg",
    badge: true,
  },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={staggerContainer(0.05)}
      className="w-14 sm:w-[66px] shrink-0 p-1.5 sm:p-2.5 h-screen overflow-y-auto bg-[#1e1f22] flex flex-col items-center py-3 sm:py-6 rounded-tr-[15px] rounded-br-[1vw] my-1 "
    >
      {/* Discord Logo */}
      <motion.button
        variants={fadeInUp}
        type="button"
        onClick={() => navigate("/")}
        aria-label="Go to home"
        whileHover={{ scale: 1.05 }}
        whileTap={tapScale}
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#313338] hover:bg-[#4650be] transition-colors duration-200 flex items-center justify-center text-white"
      >
        {/* <img
  src="https://ik.imagekit.io/pfuw6dfa6/avatarsTelegramClone/logotp.png"
  alt="Logo"
  className="w-9 h-9 sm:w-10 sm:h-10 object-contain"
  onError={(e) => {
    e.currentTarget.src = "./logotp.png";
  }}
/> */}
        
        <svg
         className="w-7 h-7 "
          viewBox="0 0 1297 1301"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1224.98 3.74188C1235.84 -1.41485 1237.2 -1.41552 1247.24 4.82684C1266.78 16.4974 1281.71 50.9664 1284.96 91.1345C1285.78 101.177 1289.03 122.075 1292.02 137.546C1296.63 160.615 1297.45 172.557 1296.36 201.326C1294.19 252.893 1284.96 284.919 1237.19 407.867C1234.48 414.652 1234.75 417.909 1239.91 429.037C1244.52 439.35 1246.69 441.792 1250.22 440.164C1252.67 439.078 1261.35 435.822 1269.49 432.837C1283.61 427.408 1284.15 427.408 1287.68 432.022C1297.72 446.135 1298.8 483.047 1289.58 511.002C1279.81 541.128 1266.51 553.884 1203.54 592.695C1097.15 658.647 1020.61 743.597 980.443 839.947C942.446 931.682 929.962 1021.79 938.918 1140.94C940.818 1163.46 941.361 1185.18 940.275 1188.98C937.019 1202 923.177 1213.95 893.322 1229.42C830.084 1262.26 767.117 1283.43 695.737 1295.91C656.655 1302.7 549.992 1302.7 508.467 1295.91C471.013 1289.67 423.516 1278 391.762 1266.87C319.839 1241.63 216.705 1179.75 206.662 1156.14C202.048 1144.74 202.862 1141.48 222.403 1107.55C266.1 1031.29 312.51 925.983 338.837 842.389L342.094 831.804L364.35 833.705C444.686 840.219 503.581 838.047 558.948 826.92C670.496 804.664 765.489 743.326 823.027 656.205C842.297 627.436 862.653 586.182 862.653 576.411C862.653 575.054 854.239 582.925 843.926 594.052C789.916 652.676 748.933 686.331 695.194 716.457C626.257 754.996 553.792 775.624 470.47 779.966C435.73 781.866 371.948 779.152 365.978 775.624C360.007 771.823 380.633 651.862 399.903 580.211C424.059 490.103 459.885 414.923 503.581 361.999C507.109 357.657 509.552 353.586 508.738 353.043C506.838 350.871 476.983 372.312 459.07 388.868C403.703 439.35 360.55 522.943 333.681 630.421C330.695 642.363 323.91 670.861 318.753 693.93C306.268 747.94 293.512 788.38 272.071 841.304C251.716 892.329 210.19 974.836 185.221 1014.46C175.45 1030.2 164.051 1048.12 160.251 1054.36C149.666 1071.46 132.839 1076.61 119.269 1066.84C109.226 1059.79 76.9287 1008.49 56.3018 966.966C29.704 912.684 4.46383 833.162 0.392578 790.28C-1.50727 768.296 2.29265 759.882 38.9326 709.129C55.217 686.602 73.6727 661.09 79.915 652.133C86.4288 643.177 106.513 615.765 124.697 591.067C142.881 566.369 160.25 542.485 162.965 537.871L168.122 529.186L144.781 501.231C110.313 459.163 94.028 435.55 75.8438 401.082C37.304 327.259 19.662 267.549 29.4326 242.58C32.4181 234.709 44.9033 227.381 55.2168 227.381C59.289 227.381 99.1854 234.166 144.238 242.58C260.672 264.021 343.18 275.148 360.55 272.163C372.763 269.72 381.72 265.106 438.715 230.909C565.733 154.644 673.482 110.676 744.319 106.062C776.617 104.162 806.472 107.962 863.467 121.803C932.947 138.631 937.833 137.817 1014.64 101.991C1063.49 78.9213 1158.49 34.6815 1186.98 21.3825C1203.54 13.7833 1220.64 5.91333 1224.98 3.74188ZM1243.17 227.381C1237.2 227.381 1225.52 237.694 1181.29 282.748C1102.03 362.813 1084.66 383.441 1068.92 416.009C1049.38 455.905 1037.98 493.359 1045.04 493.36C1055.35 493.089 1190.51 462.148 1200.55 457.534C1205.44 455.363 1208.15 451.021 1210.05 443.422C1213.04 430.665 1233.67 358.742 1245.61 318.302C1254.84 287.362 1259.18 243.395 1253.75 233.352C1251.58 229.553 1248.05 227.381 1243.17 227.381ZM887.079 202.683C887.079 201.326 885.451 200.511 883.822 200.783C881.922 200.783 875.951 201.598 870.795 202.14C858.581 203.226 815.428 210.282 789.373 215.439C756.804 221.953 742.691 227.653 705.236 249.908C675.381 267.821 607.802 321.016 611.059 324.273C613.23 326.173 667.782 317.217 706.051 308.532C760.604 296.047 780.417 288.719 804.301 272.706C828.184 256.422 887.076 206.757 887.079 202.683ZM376.022 53.9518C386.607 47.7095 400.45 50.6951 427.048 64.8083C457.989 80.8215 526.111 122.346 536.425 131.031L543.481 137.274L520.683 148.673C490.014 164.143 436.546 194.27 407.234 212.454C394.207 220.596 382.537 226.023 381.451 224.938C380.094 223.581 376.294 212.996 372.766 201.054C355.124 140.26 356.753 65.0803 376.022 53.9518Z"
            fill="white"
          />
        </svg>
      </motion.button>

      {/* Divider */}
      <div className="w-5 h-0.5 bg-[#3f4147] rounded-full my-2"></div>

      {/* Servers */}
      <div className="flex flex-col mt-2.5 gap-1.5">
        {servers.map((server) => (
          <motion.div
            key={server.id}
            variants={fadeInUp}
            className="relative group"
          >
            {/* Green Indicator */}
            <span
              className={`absolute -left-2.5 top-1/2 -translate-y-1/2 h-6 w-1 rounded-[1vw] bg-[#fcfcfca9] transition-transform duration-200 origin-center ${
                location.pathname === `/servers/${server.id}`
                  ? "scale-y-100"
                  : "scale-y-0 group-hover:scale-y-100"
              }`}
            ></span>

            <motion.button
              type="button"
              onClick={() => navigate(`/servers/${server.id}`)}
              aria-label={`Open server ${server.id}`}
              aria-current={
                location.pathname === `/servers/${server.id}`
                  ? "page"
                  : undefined
              }
              whileHover={{ scale: 1.05, borderRadius: "10px" }}
              whileTap={tapScale}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-[15px] overflow-hidden bg-[#313338] transition-colors duration-200"
            >
              <img
                src={server.image}
                alt=""
                className="w-full h-full object-cover "
              />
            </motion.button>

            {server.badge && (
              <span className="absolute -right-1 -top-1 w-5 h-5 rounded-[15px] text-white p-0.5 bg-[#252525] border-2 border-[#1e1f22] flex items-center justify-center text-[7px]">
                <Volume2 />
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-col gap-2.5 mb-5 mt-2.5">
        <motion.button
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          whileTap={tapScale}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#313338] hover:bg-[#4954c7] transition-colors flex items-center justify-center text-white"
        >
          <FaPlus size={16} />
        </motion.button>

        <motion.button
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          whileTap={tapScale}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#313338] hover:bg-[#4954c7] transition-colors flex items-center justify-center text-white"
        >
          <FaCompass size={17} />
        </motion.button>

        <motion.button
          variants={fadeInUp}
          whileHover={{ scale: 1.05 }}
          whileTap={tapScale}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-[10px] bg-[#313338] hover:bg-[#4954c7] transition-colors flex items-center justify-center text-white"
        >
          <HiArrowDownTray size={19} />
        </motion.button>
      </div>
    </motion.div>
  );
}
