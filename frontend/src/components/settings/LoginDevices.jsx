// import React from "react";
// import {
//   Monitor,
//   Smartphone,
//   Tablet,
//   Globe,
//   LogOut,
//   ShieldCheck,
//   Clock,
// } from "lucide-react";
// import { useLoginDevices } from "../../hooks/useAuth.js";

// const getDeviceIcon = (userAgent = "") => {
//   const ua = userAgent.toLowerCase();

//   if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
//     return Smartphone;
//   }

//   if (ua.includes("tablet") || ua.includes("ipad")) {
//     return Tablet;
//   }

//   return Monitor;
// };

// const getBrowserName = (userAgent = "") => {
//   const ua = userAgent.toLowerCase();

//   if (ua.includes("edg")) return "Microsoft Edge";
//   if (ua.includes("chrome")) return "Google Chrome";
//   if (ua.includes("firefox")) return "Mozilla Firefox";
//   if (ua.includes("safari")) return "Safari";

//   return "Unknown Browser";
// };

// const formatDate = (date) => {
//   if (!date) return "Unknown";

//   return new Date(date).toLocaleString("en-IN", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   });
// };

// function LoginDevices() {
//   const {
//     data: deviceData,
//     isLoading,
//     isError,
//   } = useLoginDevices();

//   const devices = deviceData?.data?.devices || [];

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-[#313338] text-white p-8">
//         <div className="max-w-4xl mx-auto">
//           <div className="h-8 w-52 bg-[#1e1f22] rounded animate-pulse mb-3" />
//           <div className="h-4 w-80 bg-[#1e1f22] rounded animate-pulse mb-8" />

//           {[1, 2, 3].map((item) => (
//             <div
//               key={item}
//               className="h-24 bg-[#2b2d31] rounded-lg mb-3 animate-pulse"
//             />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="min-h-screen bg-[#313338] text-white flex items-center justify-center">
//         <div className="text-center">
//           <p className="text-red-400 text-lg">
//             Failed to load login devices.
//           </p>
//           <p className="text-gray-400 text-sm mt-2">
//             Please try again later.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#313338] text-white">
//       <div className="max-w-4xl mx-auto px-6 py-10">

//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-2xl font-bold">
//             Devices
//           </h1>

//           <p className="text-gray-400 mt-2">
//             Manage the devices where your account is currently logged in.
//           </p>
//         </div>

//         {/* Security Banner */}
//         <div className="flex items-start gap-4 bg-[#2b2d31] border border-[#3f4147] rounded-lg p-5 mb-8">
//           <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
//             <ShieldCheck className="w-5 h-5 text-green-400" />
//           </div>

//           <div>
//             <h2 className="font-semibold">
//               Keep your account secure
//             </h2>

//             <p className="text-sm text-gray-400 mt-1">
//               If you don't recognize a device, log out of it and change your
//               password.
//             </p>
//           </div>
//         </div>

//         {/* Device Count */}
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xs font-bold uppercase tracking-wide text-gray-400">
//             Logged in devices — {devices.length}
//           </h2>
//         </div>

//         {/* Devices */}
//         <div className="space-y-3">
//           {devices.length === 0 ? (
//             <div className="bg-[#2b2d31] rounded-lg p-10 text-center">
//               <Globe className="w-10 h-10 text-gray-500 mx-auto mb-3" />

//               <p className="text-gray-300">
//                 No login devices found.
//               </p>
//             </div>
//           ) : (
//             devices.map((device) => {
//               const DeviceIcon = getDeviceIcon(device.userAgent);

//               return (
//                 <div
//                   key={device._id}
//                   className="bg-[#2b2d31] hover:bg-[#35373c] transition rounded-lg p-5 flex items-center justify-between gap-4"
//                 >
//                   {/* Device Info */}
//                   <div className="flex items-center gap-4 min-w-0">

//                     {/* Icon */}
//                     <div className="w-12 h-12 rounded-lg bg-[#1e1f22] flex items-center justify-center shrink-0">
//                       <DeviceIcon className="w-6 h-6 text-gray-300" />
//                     </div>

//                     {/* Details */}
//                     <div className="min-w-0">
//                       <div className="flex items-center gap-2">
//                         <h3 className="font-semibold truncate">
//                           {getBrowserName(device.userAgent)}
//                         </h3>

//                         {/* Current Device */}
//                         {device.isCurrent && (
//                           <span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">
//                             Current Device
//                           </span>
//                         )}
//                       </div>

//                       <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-400 mt-1">

//                         <span>
//                           {device.deviceId || "Unknown device"}
//                         </span>

//                         {device.ip && (
//                           <>
//                             <span>•</span>
//                             <span>
//                               {device.ip}
//                             </span>
//                           </>
//                         )}
//                       </div>

//                       <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
//                         <Clock className="w-3.5 h-3.5" />

//                         <span>
//                           Last active{" "}
//                           {formatDate(
//                             device.updatedAt || device.createdAt
//                           )}
//                         </span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Logout */}
//                   {!device.isCurrent && (
//                     <button
//                       className="shrink-0 flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-red-400 hover:bg-red-500/10 transition"
//                     >
//                       <LogOut className="w-4 h-4" />

//                       <span className="hidden sm:block">
//                         Log Out
//                       </span>
//                     </button>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {/* Bottom Information */}
//         {devices.length > 0 && (
//           <div className="mt-8 pt-6 border-t border-[#3f4147]">
//             <div className="flex items-center gap-3 text-gray-400">
//               <ShieldCheck className="w-5 h-5" />

//               <p className="text-sm">
//                 You can review all active sessions associated with your
//                 account here.
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default LoginDevices;
import React from "react";
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  LogOut,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { useLoginDevices } from "../../hooks/useAuth.js";

// Real endpoint shape:
// {
//   success: true,
//   count: 1,
//   devices: [
//     { _id, userId, deviceId, verify, expiryDate, browser, os,
//       ipAddress, userAgent, lastActiveAt, createdAt, updatedAt }
//   ]
// }

const getDeviceIcon = (device = {}) => {
  const source = `${device.os || ""} ${device.userAgent || ""}`.toLowerCase();
  if (source.includes("android") || source.includes("iphone") || source.includes("mobile")) {
    return Smartphone;
  }
  if (source.includes("ipad") || source.includes("tablet")) {
    return Tablet;
  }
  return Monitor;
};

const getLabel = (device = {}) => {
  const browser = device.browser && device.browser !== "Unknown Browser" ? device.browser : null;
  const os = device.os && device.os !== "Unknown OS" ? device.os : null;
  if (browser && os) return `${browser} on ${os}`;
  return browser || os || device.deviceId || "Unknown device";
};

const formatDate = (date) => {
  if (!date) return "Unknown";
  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// The API doesn't return an isCurrent flag, so infer it by matching against
// the deviceId this browser sent when it logged in (stored locally at login time).
const isCurrentDevice = (device) => {
  const localDeviceId = typeof window !== "undefined" ? localStorage.getItem("deviceId") : null;
  return !!localDeviceId && device.deviceId === localDeviceId;
};

function LoginDevices() {
  const { data: response, isLoading, isError } = useLoginDevices();
  // Support either the raw API payload ({ success, count, devices }) or a
  // wrapped axios/react-query response ({ data: { devices } }).
  const devices = response?.devices || response?.data?.devices || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#313338] text-[#dbdee1] font-sans">
        <div className="max-w-[740px] mx-auto px-10 py-16">
          <div className="h-3 w-24 bg-[#3f4147] rounded animate-pulse mb-4" />
          <div className="h-7 w-56 bg-[#3f4147] rounded animate-pulse mb-8" />
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-20 bg-[#2b2d31] rounded-lg mb-2.5 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#313338] flex items-center justify-center font-sans">
        <div className="text-center">
          <p className="text-[#f23f42] font-medium">Couldn't load your devices</p>
          <p className="text-[#949ba4] text-sm mt-1">Give it another try in a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-[#313338] font-sans">
      <div className="max-w-[95%] mx-auto ">
        {/* Eyebrow + title, Discord settings style */}
        <p className="text-xs font-bold uppercase tracking-wide text-[#949ba4] mb-1">
          My Account
        </p>
        <h1 className="text-xl font-semibold text-white mb-1">Devices</h1>
        <p className="text-sm text-[#b5bac1] mb-6 max-w-[520px]">
          These are the devices currently signed in to your account. Log out
          of anything you don't recognize.
        </p>

        <div className="h-px bg-[#3f4147] mb-6" />

        {/* Current session callout */}
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="w-4 h-4 text-[#23a559] shrink-0" />
          <p className="text-sm text-[#b5bac1]">
            <span className="text-white font-medium">{devices.length}</span>{" "}
            {devices.length === 1 ? "device is" : "devices are"} currently logged in
          </p>
        </div>

        {/* Device list */}
        <div className="flex flex-col gap-2.5">
          {devices.length === 0 ? (
            <div className="bg-[#2b2d31] rounded-lg py-12 text-center">
              <Globe className="w-8 h-8 text-[#4e5058] mx-auto mb-3" />
              <p className="text-[#b5bac1] text-sm">No devices found.</p>
            </div>
          ) : (
            devices.map((device) => {
              const DeviceIcon = getDeviceIcon(device);
              const current = isCurrentDevice(device);
              return (
                <div
                  key={device._id}
                  className="group bg-[#2b2d31] rounded-lg px-4 py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#1e1f22] flex items-center justify-center shrink-0">
                      <DeviceIcon className="w-[18px] h-[18px] text-[#b5bac1]" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-white truncate">
                          {getLabel(device)}
                        </h3>
                        {current && (
                          <span className="text-[11px] font-medium text-[#23a559] bg-[#23a55919] px-1.5 py-[1px] rounded shrink-0">
                            This device
                          </span>
                        )}
                        {!device.verify && (
                          <span className="text-[11px] font-medium text-[#f0b232] bg-[#f0b23219] px-1.5 py-[1px] rounded shrink-0">
                            Unverified
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-2 text-xs text-[#949ba4] mt-0.5">
                        {device.ipAddress && <span>{device.ipAddress}</span>}
                        <span className="text-[#5c5e66]">•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Active {formatDate(device.lastActiveAt || device.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {!current && (
                    <button
                      className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-[#dbdee1] bg-[#4e505810] hover:bg-[#f23f42] hover:text-white transition-colors duration-100"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Log out
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginDevices;