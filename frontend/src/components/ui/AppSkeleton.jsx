// import { Skeleton, SkeletonCircle, SkeletonList } from "./Skeleton.jsx";

// // ---- Space background data (computed once at module load: no state/timers) ----
// const COLORS = { white: "#ffffff", silver: "#d9d9d9", gray: "#b3b3b3" };
// const frac = (n) => n - Math.floor(n);

// // 36 falling stars in three depth tiers (far = slow/faint, mid, fast = bright).
// const STARS = Array.from({ length: 36 }, (_, i) => {
//   const n = i + 1;
//   const tier = i < 14 ? "far" : i < 26 ? "mid" : "fast";
//   const r1 = frac(n * 0.6180339);
//   const r2 = frac(n * 0.7548776);
//   const r3 = frac(n * 0.5698403);
//   const r4 = frac(n * 0.3247179 + 0.2);
//   const r5 = frac(n * 0.8191725 + 0.4);
//   const [size, peak, dur, len, sway] =
//     tier === "far"
//       ? [1 + r1 * 0.4, 0.55 + r2 * 0.2, 38 + r3 * 22, 1, 20]
//       : tier === "mid"
//         ? [1.6 + r1 * 0.5, 0.7 + r2 * 0.2, 15 + r3 * 13, 1.4, 30]
//         : [2 + r1 * 0.8, 0.8 + r2 * 0.2, 6.5 + r3 * 5, 3, 44];
//   const color =
//     i % 5 === 0 ? COLORS.silver : i % 2 === 0 ? COLORS.gray : COLORS.white;
//   return {
//     className:
//       `wolvo-star` + (i % 2 === 0 ? " wolvo-star-tw" : ""),
//     style: {
//       "--x": `${(frac(n * 0.6180339 + 0.07) * 98 + 1).toFixed(1)}%`,
//       "--y": `${(r4 * 100).toFixed(1)}vh`,
//       "--s": `${size.toFixed(2)}px`,
//       "--l": len,
//       "--o": Math.min(1, peak).toFixed(2),
//       "--c": color,
//       "--d": `${dur.toFixed(1)}s`,
//       "--dl": `${(-r4 * dur).toFixed(1)}s`,
//       "--dx": `${((r5 - 0.5) * sway).toFixed(0)}px`,
//       "--t": `${(2.2 + r2 * 3.5).toFixed(1)}s`,
//       "--tl": `${(-r1 * 5).toFixed(1)}s`,
//     },
//   };
// });

// // A few rare shooting stars (each travels only briefly in a long cycle).
// const SHOOTERS = [
//   { "--x": "6%",  "--y": "8%",  "--w": "130px", "--r": "30deg",  "--tx": "46vw",  "--ty": "26.6vw", "--d": "19s", "--dl": "3s" },
//   { "--x": "58%", "--y": "4%",  "--w": "110px", "--r": "28deg",  "--tx": "40vw",  "--ty": "21.3vw", "--d": "26s", "--dl": "10s" },
//   { "--x": "94%", "--y": "16%", "--w": "120px", "--r": "152deg", "--tx": "-44vw", "--ty": "23.4vw", "--d": "31s", "--dl": "16s" },
// ];

// // Orbiting particles around centres spread across the scene (none on the logo).
// // --e flattens the circle into an ellipse, --tilt rotates it, --dir sets the spin direction.
// const ORBITS = [
//   { "--cx": "14%", "--cy": "24%", "--r": "22vmin", "--e": 0.45, "--tilt": "-18deg", "--d": "46s", "--dl": "-12s", "--dir": "normal",  "--s": "3px",   "--c": COLORS.gray,   "--o": 0.9,  "--g": "7s",  "--gl": "-2s" },
//   { "--cx": "84%", "--cy": "20%", "--r": "17vmin", "--e": 0.55, "--tilt": "24deg",  "--d": "38s", "--dl": "-20s", "--dir": "reverse", "--s": "2.5px", "--c": COLORS.white, "--o": 0.85, "--g": "9s",  "--gl": "-5s" },
//   { "--cx": "22%", "--cy": "80%", "--r": "26vmin", "--e": 0.4,  "--tilt": "12deg",  "--d": "62s", "--dl": "-30s", "--dir": "reverse", "--s": "3.5px", "--c": COLORS.white,  "--o": 0.8,  "--g": "11s", "--gl": "-7s" },
//   { "--cx": "80%", "--cy": "74%", "--r": "20vmin", "--e": 0.5,  "--tilt": "-30deg", "--d": "52s", "--dl": "-8s",  "--dir": "normal",  "--s": "2.5px", "--c": COLORS.gray,  "--o": 0.9,  "--g": "8s",  "--gl": "-1s" },
//   { "--cx": "50%", "--cy": "9%",  "--r": "15vmin", "--e": 0.35, "--tilt": "6deg",   "--d": "34s", "--dl": "-15s", "--dir": "reverse", "--s": "2px",   "--c": COLORS.gray,   "--o": 0.8,  "--g": "6s",  "--gl": "-3s" },
//   { "--cx": "92%", "--cy": "52%", "--r": "13vmin", "--e": 0.6,  "--tilt": "70deg",  "--d": "30s", "--dl": "-5s",  "--dir": "normal",  "--s": "2px",   "--c": COLORS.white,  "--o": 0.75, "--g": "10s", "--gl": "-6s" },
// ];

// /** Full-app loading skeleton shown while the auth/session check is in flight. */
// export default function AppSkeleton() {
//   return (
//     <div
//       className="relative flex h-screen bg-[#1f1f1f9c] overflow-hidden"
//       aria-busy="true"
//     >
//       {/* Server rail */}
//       <div
//         aria-hidden="true"
//         className="hidden sm:flex w-[66px] p-2.5 py-6 flex-col items-center gap-3 bg-[#1e1f22]"
//       >
//         <SkeletonCircle className="w-11 h-11" />
//         <div className="w-5 h-[2px] bg-[#3f4147] rounded-full my-1" />
//         {Array.from({ length: 4 }).map((_, i) => (
//           <SkeletonCircle key={i} className="w-10 h-10" />
//         ))}
//       </div>

//       {/* Channel sidebar */}
//       <div
//         aria-hidden="true"
//         className="hidden md:flex w-[240px] p-3 flex-col bg-[#03030373] gap-3"
//       >
//         <Skeleton className="h-8 w-full rounded-md" />
//         <Skeleton className="h-6 w-2/3 rounded-md" />
//         <Skeleton className="h-6 w-1/2 rounded-md" />
//         <div className="mt-4">
//           <Skeleton className="h-3 w-1/3 mb-3" />
//           <SkeletonList rows={4} />
//         </div>
//       </div>

//       {/* Main area */}
//       <div aria-hidden="true" className="flex-1 flex flex-col p-4 gap-4">
//         <Skeleton className="h-10 w-1/3 rounded-md" />
//         <div className="flex-1 rounded-2xl bg-[#000000] p-4">
//           <SkeletonList rows={6} />
//         </div>
//       </div>

//       {/* Active now panel */}
//       <div
//         aria-hidden="true"
//         className="hidden lg:flex w-[360px] p-4 flex-col gap-3 bg-[#1a1b1f93]"
//       >
//         <Skeleton className="h-5 w-1/2 mb-2" />
//         {Array.from({ length: 3 }).map((_, i) => (
//           <div
//             key={i}
//             className="rounded-lg bg-[#111214]/60 p-3 flex items-center gap-3"
//           >
//             <SkeletonCircle className="w-8 h-8" />
//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-3 w-2/3" />
//               <Skeleton className="h-2.5 w-1/3" />
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Center logo + name */}
//       <div className="wolvo-overlay absolute inset-0 z-10 flex bg-black/70 flex-col items-center justify-center pointer-events-none">
//         <style>{`
//           /* Soft fade-in so the overlay settles in instead of popping */
//           .wolvo-overlay { animation: wolvo-fade-in .4s ease-out both; }
//           @keyframes wolvo-fade-in {
//             from { opacity: 0; }
//             to   { opacity: 1; }
//           }

//           .wolvo-space {
//             position: absolute;
//             inset: 0;
//             z-index: -2;
//             overflow: hidden;
//             pointer-events: none;
//             background: rgba(0,0,0,.45);
//           }

//           /* ---- Falling stars ----
//              The wrapper falls and fades in/out (transform + opacity, so it loops
//              invisibly: opacity is 0 at both ends). The ::before dot twinkles
//              independently. All per-star values come from CSS variables. */
//           .wolvo-star {
//             position: absolute;
//             top: -12px;
//             left: var(--x);
//             width: var(--s);
//             height: calc(var(--s) * var(--l));
//             opacity: var(--o);
//             animation: wolvo-fall var(--d) linear var(--dl) infinite;
//             will-change: transform, opacity;
//           }
//           .wolvo-star::before {
//             content: "";
//             position: absolute;
//             inset: 0;
//             border-radius: 9999px;
//             background: var(--c);
//             box-shadow:
//               0 0 calc(var(--s) * 3) calc(var(--s) * .4) var(--c),
//               0 0 calc(var(--s) * 7) var(--c);
//           }
//           .wolvo-star-tw::before {
//             animation: wolvo-tw var(--t) ease-in-out var(--tl) infinite;
//           }
//           @keyframes wolvo-fall {
//             0%   { transform: translate3d(0, 0, 0); opacity: 0; }
//             12%  { opacity: calc(var(--o) * .6); }
//             45%  { opacity: var(--o); }
//             88%  { opacity: calc(var(--o) * .5); }
//             100% { transform: translate3d(var(--dx), calc(100vh + 24px), 0); opacity: 0; }
//           }
//           @keyframes wolvo-tw {
//             0%, 100% { opacity: 1; }
//             50%      { opacity: .35; }
//           }

//           /* ---- Shooting stars: rare, travel only in the first ~7% of a long cycle ---- */
//           .wolvo-shoot {
//             position: absolute;
//             top: var(--y);
//             left: var(--x);
//             width: var(--w);
//             height: 3px;
//             opacity: 0;
//             background:
//               radial-gradient(circle at 100% 50%, #fff 0, rgba(255,255,255,0) 4px),
//               linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.85));
//             animation: wolvo-shoot var(--d) linear var(--dl) infinite;
//             will-change: transform, opacity;
//           }
//           @keyframes wolvo-shoot {
//             0%   { opacity: 0; transform: translate3d(0, 0, 0) rotate(var(--r)); }
//             1.5% { opacity: 1; }
//             7%   { opacity: 0; transform: translate3d(var(--tx), var(--ty), 0) rotate(var(--r)); }
//             100% { opacity: 0; transform: translate3d(var(--tx), var(--ty), 0) rotate(var(--r)); }
//           }

//           /* ---- Orbits: tilted + flattened wrapper = ellipse; the spinner rotates the dot ---- */
//           .wolvo-orbit {
//             position: absolute;
//             left: var(--cx);
//             top: var(--cy);
//             width: 0;
//             height: 0;
//             transform: rotate(var(--tilt)) scaleY(var(--e));
//           }
//           .wolvo-orbit::before {
//             content: "";
//             position: absolute;
//             left: calc(var(--r) * -1);
//             top: calc(var(--r) * -1);
//             width: calc(var(--r) * 2);
//             height: calc(var(--r) * 2);
//             border-radius: 9999px;
//             border: 1px solid rgba(255,255,255,.06);
//           }
//           .wolvo-orbit-spin {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 0;
//             height: 0;
//             animation: wolvo-spin var(--d) linear var(--dl) infinite;
//             animation-direction: var(--dir);
//             will-change: transform;
//           }
//           @keyframes wolvo-spin {
//             from { transform: rotate(0deg); }
//             to   { transform: rotate(360deg); }
//           }
//           .wolvo-orb {
//             position: absolute;
//             left: var(--r);
//             top: 0;
//             width: var(--s);
//             height: var(--s);
//             margin: calc(var(--s) * -.5) 0 0 calc(var(--s) * -.5);
//             border-radius: 9999px;
//             background: var(--c);
//             box-shadow:
//               0 0 calc(var(--s) * 3) calc(var(--s) * .5) var(--c),
//               0 0 calc(var(--s) * 8) var(--c);
//             opacity: .15;
//             animation: wolvo-orb var(--g) ease-in-out var(--gl) infinite;
//           }
//           @keyframes wolvo-orb {
//             0%, 100% { opacity: .15; }
//             50%      { opacity: var(--o); }
//           }

//           .wolvo-logo { animation: wolvo-bob 2.6s ease-in-out infinite; }
//           @keyframes wolvo-bob {
//             0%, 100% { transform: translateY(0) rotate(-1.5deg); }
//             50%      { transform: translateY(-8px) rotate(1.5deg); }
//           }

//           .wolvo-waves path { opacity: 0; animation: wolvo-wave 1.8s ease-out infinite; }
//           .wolvo-waves path:nth-child(2) { animation-delay: 0s; }
//           .wolvo-waves path:nth-child(1) { animation-delay: .25s; }
//           .wolvo-waves path:nth-child(3) { animation-delay: .5s; }
//           .wolvo-waves path:nth-child(4) { animation-delay: .75s; }
//           @keyframes wolvo-wave {
//             0%   { opacity: 0; transform: translateX(-40px); }
//             25%  { opacity: 1; }
//             70%  { opacity: 0; transform: translateX(30px); }
//             100% { opacity: 0; transform: translateX(30px); }
//           }

//           /* Status line gently breathes with the logo */
//           .wolvo-status { animation: wolvo-status 2.6s ease-in-out infinite; }
//           @keyframes wolvo-status {
//             0%, 100% { opacity: .7; }
//             50%      { opacity: 1; }
//           }

//           @media (prefers-reduced-motion: reduce) {
//             .wolvo-overlay, .wolvo-logo, .wolvo-status, .wolvo-star, .wolvo-star::before, .wolvo-shoot, .wolvo-orbit-spin, .wolvo-orb, .wolvo-waves path { animation: none !important; }
//             .wolvo-star { transform: translate3d(0, var(--y), 0); }
//             .wolvo-orb { opacity: .5; }
//             .wolvo-shoot { display: none; }
//             .wolvo-waves path { opacity: 1; }
//           }
//         `}</style>

//         {/* Deep-space atmosphere: decorative, behind everything in the overlay */}
//         <div className="wolvo-space" aria-hidden="true">
//           {ORBITS.map((orbit, i) => (
//             <div key={i} className="wolvo-orbit" style={orbit}>
//               <span className="wolvo-orbit-spin">
//                 <i className="wolvo-orb" />
//               </span>
//             </div>
//           ))}
//           {STARS.map((star, i) => (
//             <span key={i} className={star.className} style={star.style} />
//           ))}
//           {SHOOTERS.map((shooter, i) => (
//             <span key={i} className="wolvo-shoot" style={shooter} />
//           ))}
//         </div>

//         <svg
//           className="wolvo-logo w-24 h-24 pb-4 overflow-visible"
//           viewBox="0 0 1297 1301"
//           fill="none"
//           xmlns="http://www.w3.org/2000/svg"
//           aria-hidden="true"
//           focusable="false"
//         >
//           <path
//             className="wolvo-body"
//             fill="white"
//             d="M1224.98 3.74188C1235.84 -1.41485 1237.2 -1.41552 1247.24 4.82684C1266.78 16.4974 1281.71 50.9664 1284.96 91.1345C1285.78 101.177 1289.03 122.075 1292.02 137.546C1296.63 160.615 1297.45 172.557 1296.36 201.326C1294.19 252.893 1284.96 284.919 1237.19 407.867C1234.48 414.652 1234.75 417.909 1239.91 429.037C1244.52 439.35 1246.69 441.792 1250.22 440.164C1252.67 439.078 1261.35 435.822 1269.49 432.837C1283.61 427.408 1284.15 427.408 1287.68 432.022C1297.72 446.135 1298.8 483.047 1289.58 511.002C1279.81 541.128 1266.51 553.884 1203.54 592.695C1097.15 658.647 1020.61 743.597 980.443 839.947C942.446 931.682 929.962 1021.79 938.918 1140.94C940.818 1163.46 941.361 1185.18 940.275 1188.98C937.019 1202 923.177 1213.95 893.322 1229.42C830.084 1262.26 767.117 1283.43 695.737 1295.91C656.655 1302.7 549.992 1302.7 508.467 1295.91C471.013 1289.67 423.516 1278 391.762 1266.87C319.839 1241.63 216.705 1179.75 206.662 1156.14C202.048 1144.74 202.862 1141.48 222.403 1107.55C266.1 1031.29 312.51 925.983 338.837 842.389L342.094 831.804L364.35 833.705C444.686 840.219 503.581 838.047 558.948 826.92C670.496 804.664 765.489 743.326 823.027 656.205C842.297 627.436 862.653 586.182 862.653 576.411C862.653 575.054 854.239 582.925 843.926 594.052C789.916 652.676 748.933 686.331 695.194 716.457C626.257 754.996 553.792 775.624 470.47 779.966C435.73 781.866 371.948 779.152 365.978 775.624C360.007 771.823 380.633 651.862 399.903 580.211C424.059 490.103 459.885 414.923 503.581 361.999C507.109 357.657 509.552 353.586 508.738 353.043C506.838 350.871 476.983 372.312 459.07 388.868C403.703 439.35 360.55 522.943 333.681 630.421C330.695 642.363 323.91 670.861 318.753 693.93C306.268 747.94 293.512 788.38 272.071 841.304C251.716 892.329 210.19 974.836 185.221 1014.46C175.45 1030.2 164.051 1048.12 160.251 1054.36C149.666 1071.46 132.839 1076.61 119.269 1066.84C109.226 1059.79 76.9287 1008.49 56.3018 966.966C29.704 912.684 4.46383 833.162 0.392578 790.28C-1.50727 768.296 2.29265 759.882 38.9326 709.129C55.217 686.602 73.6727 661.09 79.915 652.133C86.4288 643.177 106.513 615.765 124.697 591.067C142.881 566.369 160.25 542.485 162.965 537.871L168.122 529.186L144.781 501.231C110.313 459.163 94.028 435.55 75.8438 401.082C37.304 327.259 19.662 267.549 29.4326 242.58C32.4181 234.709 44.9033 227.381 55.2168 227.381C59.289 227.381 99.1854 234.166 144.238 242.58C260.672 264.021 343.18 275.148 360.55 272.163C372.763 269.72 381.72 265.106 438.715 230.909C565.733 154.644 673.482 110.676 744.319 106.062C776.617 104.162 806.472 107.962 863.467 121.803C932.947 138.631 937.833 137.817 1014.64 101.991C1063.49 78.9213 1158.49 34.6815 1186.98 21.3825C1203.54 13.7833 1220.64 5.91333 1224.98 3.74188ZM1243.17 227.381C1237.2 227.381 1225.52 237.694 1181.29 282.748C1102.03 362.813 1084.66 383.441 1068.92 416.009C1049.38 455.905 1037.98 493.359 1045.04 493.36C1055.35 493.089 1190.51 462.148 1200.55 457.534C1205.44 455.363 1208.15 451.021 1210.05 443.422C1213.04 430.665 1233.67 358.742 1245.61 318.302C1254.84 287.362 1259.18 243.395 1253.75 233.352C1251.58 229.553 1248.05 227.381 1243.17 227.381ZM887.079 202.683C887.079 201.326 885.451 200.511 883.822 200.783C881.922 200.783 875.951 201.598 870.795 202.14C858.581 203.226 815.428 210.282 789.373 215.439C756.804 221.953 742.691 227.653 705.236 249.908C675.381 267.821 607.802 321.016 611.059 324.273C613.23 326.173 667.782 317.217 706.051 308.532C760.604 296.047 780.417 288.719 804.301 272.706C828.184 256.422 887.076 206.757 887.079 202.683ZM376.022 53.9518C386.607 47.7095 400.45 50.6951 427.048 64.8083C457.989 80.8215 526.111 122.346 536.425 131.031L543.481 137.274L520.683 148.673C490.014 164.143 436.546 194.27 407.234 212.454C394.207 220.596 382.537 226.023 381.451 224.938C380.094 223.581 376.294 212.996 372.766 201.054C355.124 140.26 356.753 65.0803 376.022 53.9518Z"
//           />

//           {/* sound waves, mapped from the HTML logo into this viewBox */}
//           <g
//             className="wolvo-waves"
//             fill="white"
//             transform="scale(0.8917) translate(-559 -617)"
//           >
//             <path d="M2175.57 1116.41C2190.59 1032.13 2174.2 945.273 2129.51 872.262L2080.16 902.47C2117.47 963.411 2131.15 1035.91 2118.61 1106.26L2175.57 1116.41Z" />
//             <path d="M2070.87 1089.85C2079.52 1041.34 2070.09 991.328 2044.35 949.295L2015.95 966.686C2037.42 1001.77 2045.3 1043.51 2038.08 1084.01L2070.87 1089.85Z" />
//             <path d="M2299.8 1169.05C2325.25 1026.26 2297.48 879.091 2221.76 755.389L2152.14 798.009C2217.44 904.683 2241.38 1031.59 2219.44 1154.72L2299.8 1169.05Z" />
//             <path d="M2510.08 1233.79C2551.36 1002.15 2506.32 763.407 2383.47 562.73L2256.57 640.417C2360.41 810.055 2398.49 1011.87 2363.59 1207.68L2510.08 1233.79Z" />
//           </g>
//         </svg>
//         <div className="text-center" role="status" aria-live="polite">
//           <h1 className="text-white text-2xl font-normal tracking-wide">
//             Wolvo
//           </h1>
//           <p className="wolvo-status mt-1 text-sm font-normal text-white/50">
//             Getting things ready...
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
import { Skeleton, SkeletonCircle, SkeletonList } from "./Skeleton.jsx";

// ---- Space background data (computed once at module load: no state/timers) ----
const COLORS = { white: "#FFFFFF", silver: "color-mix(in srgb, #FFFFFF 68%, #000000)" };
const frac = (n) => n - Math.floor(n);

// 36 falling stars in three depth tiers (far = slow/faint, mid, fast = bright).
const STARS = Array.from({ length: 36 }, (_, i) => {
  const n = i + 1;
  const tier = i < 14 ? "far" : i < 26 ? "mid" : "fast";
  const r1 = frac(n * 0.6180339);
  const r2 = frac(n * 0.7548776);
  const r3 = frac(n * 0.5698403);
  const r4 = frac(n * 0.3247179 + 0.2);
  const r5 = frac(n * 0.8191725 + 0.4);
  const [size, peak, dur, len, sway] =
    tier === "far"
      ? [1 + r1 * 0.4, 0.55 + r2 * 0.2, 38 + r3 * 22, 1, 20]
      : tier === "mid"
        ? [1.6 + r1 * 0.5, 0.7 + r2 * 0.2, 15 + r3 * 13, 1.4, 30]
        : [2 + r1 * 0.8, 0.8 + r2 * 0.2, 6.5 + r3 * 5, 3, 44];
  const color =
    i % 4 === 0 ? COLORS.silver : COLORS.white;
  return {
    className:
      `wolvo-star` + (i % 2 === 0 ? " wolvo-star-tw" : ""),
    style: {
      "--x": `${(frac(n * 0.6180339 + 0.07) * 98 + 1).toFixed(1)}%`,
      "--y": `${(r4 * 100).toFixed(1)}vh`,
      "--s": `${size.toFixed(2)}px`,
      "--l": len,
      "--o": Math.min(1, peak).toFixed(2),
      "--c": color,
      "--d": `${dur.toFixed(1)}s`,
      "--dl": `${(-r4 * dur).toFixed(1)}s`,
      "--dx": `${((r5 - 0.5) * sway).toFixed(0)}px`,
      "--t": `${(2.2 + r2 * 3.5).toFixed(1)}s`,
      "--tl": `${(-r1 * 5).toFixed(1)}s`,
    },
  };
});

// A few rare shooting stars (each travels only briefly in a long cycle).
const SHOOTERS = [
  { "--x": "6%",  "--y": "8%",  "--w": "130px", "--r": "30deg",  "--tx": "46vw",  "--ty": "26.6vw", "--d": "19s", "--dl": "3s" },
  { "--x": "58%", "--y": "4%",  "--w": "110px", "--r": "28deg",  "--tx": "40vw",  "--ty": "21.3vw", "--d": "26s", "--dl": "10s" },
  { "--x": "94%", "--y": "16%", "--w": "120px", "--r": "152deg", "--tx": "-44vw", "--ty": "23.4vw", "--d": "31s", "--dl": "16s" },
];

// Orbiting particles around centres spread across the scene (none on the logo).
// --e flattens the circle into an ellipse, --tilt rotates it, --dir sets the spin direction.
const ORBITS = [
  { "--cx": "14%", "--cy": "24%", "--r": "22vmin", "--e": 0.45, "--tilt": "-18deg", "--d": "46s", "--dl": "-12s", "--dir": "normal",  "--s": "3px",   "--c": COLORS.silver,   "--o": 0.9,  "--g": "7s",  "--gl": "-2s" },
  { "--cx": "84%", "--cy": "20%", "--r": "17vmin", "--e": 0.55, "--tilt": "24deg",  "--d": "38s", "--dl": "-20s", "--dir": "reverse", "--s": "2.5px", "--c": COLORS.white, "--o": 0.85, "--g": "9s",  "--gl": "-5s" },
  { "--cx": "22%", "--cy": "80%", "--r": "26vmin", "--e": 0.4,  "--tilt": "12deg",  "--d": "62s", "--dl": "-30s", "--dir": "reverse", "--s": "3.5px", "--c": COLORS.silver,  "--o": 0.8,  "--g": "11s", "--gl": "-7s" },
  { "--cx": "80%", "--cy": "74%", "--r": "20vmin", "--e": 0.5,  "--tilt": "-30deg", "--d": "52s", "--dl": "-8s",  "--dir": "normal",  "--s": "2.5px", "--c": COLORS.silver,  "--o": 0.9,  "--g": "8s",  "--gl": "-1s" },
  { "--cx": "50%", "--cy": "9%",  "--r": "15vmin", "--e": 0.35, "--tilt": "6deg",   "--d": "34s", "--dl": "-15s", "--dir": "reverse", "--s": "2px",   "--c": COLORS.silver,   "--o": 0.8,  "--g": "6s",  "--gl": "-3s" },
  { "--cx": "92%", "--cy": "52%", "--r": "13vmin", "--e": 0.6,  "--tilt": "70deg",  "--d": "30s", "--dl": "-5s",  "--dir": "normal",  "--s": "2px",   "--c": COLORS.silver,  "--o": 0.75, "--g": "10s", "--gl": "-6s" },
];

// Irregular asteroid silhouettes.
const CLIPS = [
  "polygon(18% 8%, 52% 0, 86% 16%, 100% 52%, 82% 88%, 46% 100%, 12% 80%, 0 40%)",
  "polygon(10% 20%, 40% 0, 78% 10%, 100% 38%, 90% 76%, 58% 100%, 20% 90%, 0 56%)",
  "polygon(24% 0, 66% 6%, 98% 30%, 88% 70%, 60% 98%, 22% 86%, 2% 48%)",
  "polygon(8% 30%, 36% 2%, 74% 0, 100% 34%, 94% 72%, 64% 96%, 26% 100%, 0 64%)",
  "polygon(14% 14%, 56% 0, 92% 22%, 96% 62%, 70% 100%, 30% 94%, 0 58%)",
];
// rock(shape, size in vmin, [x0, y0], [x1, y1], travel s, delay s, tumble s, tumble dir, opacity)
// Paths stay in the upper and lower bands and start/end off-screen, so loops are seamless.
const rock = (c, size, [x0, y0], [x1, y1], d, dl, r, rd, o) => ({
  "--clip": CLIPS[c], "--s": `${size}vmin`,
  "--x0": x0, "--y0": y0, "--x1": x1, "--y1": y1,
  "--d": `${d}s`, "--dl": `${dl}s`, "--r": `${r}s`, "--rd": rd, "--o": o,
});
const ROCKS = [
  rock(0, 3.4, ["-8vw", "14vh"],  ["108vw", "26vh"],  120, -35, 46, "normal",  0.9),
  rock(1, 2.4, ["108vw", "84vh"], ["-8vw", "72vh"],   95,  -60, 33, "reverse", 0.85),
  rock(2, 2.9, ["-8vw", "79vh"],  ["108vw", "91vh"],  150, -90, 58, "normal",  0.8),
  rock(3, 1.9, ["108vw", "22vh"], ["-8vw", "9vh"],    85,  -20, 27, "reverse", 0.8),
  rock(4, 2.2, ["82vw", "-8vh"],  ["96vw", "108vh"],  110, -50, 40, "normal",  0.75),
  // tiny distant rocks
  rock(1, 0.7, ["-8vw", "30vh"],  ["108vw", "36vh"],  70,  -10, 20, "normal",  0.6),
  rock(2, 0.5, ["108vw", "60vh"], ["-8vw", "66vh"],   64,  -40, 16, "reverse", 0.55),
  rock(3, 0.8, ["-8vw", "88vh"],  ["108vw", "80vh"],  105, -70, 24, "normal",  0.6),
  rock(0, 0.6, ["20vw", "-8vh"],  ["8vw", "108vh"],   90,  -30, 18, "reverse", 0.5),
  rock(4, 0.9, ["108vw", "12vh"], ["-8vw", "18vh"],   130, -100, 30, "normal", 0.65),
  rock(1, 0.5, ["38vw", "108vh"], ["22vw", "-8vh"],   75,  -55, 14, "reverse", 0.5),
];

// One distant satellite on a slow elliptical path, left of the centre content.
// --a / --b are the horizontal / vertical radii; --D is half the orbital period.
const SATELLITE = { "--cx": "26%", "--cy": "32%", "--a": "17vw", "--b": "9vh", "--D": "60s" };

/** Full-app loading skeleton shown while the auth/session check is in flight. */
export default function AppSkeleton() {
  return (
    <div
      className="relative flex h-screen bg-[#1f1f1f9c] overflow-hidden"
      aria-busy="true"
    >
      {/* Server rail */}
      <div
        aria-hidden="true"
        className="hidden sm:flex w-[66px] p-2.5 py-6 flex-col items-center gap-3 bg-[#1e1f22]"
      >
        <SkeletonCircle className="w-11 h-11" />
        <div className="w-5 h-[2px] bg-[#3f4147] rounded-full my-1" />
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCircle key={i} className="w-10 h-10" />
        ))}
      </div>

      {/* Channel sidebar */}
      <div
        aria-hidden="true"
        className="hidden md:flex w-[240px] p-3 flex-col bg-[#03030373] gap-3"
      >
        <Skeleton className="h-8 w-full rounded-md" />
        <Skeleton className="h-6 w-2/3 rounded-md" />
        <Skeleton className="h-6 w-1/2 rounded-md" />
        <div className="mt-4">
          <Skeleton className="h-3 w-1/3 mb-3" />
          <SkeletonList rows={4} />
        </div>
      </div>

      {/* Main area */}
      <div aria-hidden="true" className="flex-1 flex flex-col p-4 gap-4">
        <Skeleton className="h-10 w-1/3 rounded-md" />
        <div className="flex-1 rounded-2xl bg-black/50 p-4">
          <SkeletonList rows={6} />
        </div>
      </div>

      {/* Active now panel */}
      <div
        aria-hidden="true"
        className="hidden lg:flex w-[360px] p-4 flex-col gap-3 bg-[#1a1b1f93]"
      >
        <Skeleton className="h-5 w-1/2 mb-2" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg bg-[#111214]/60 p-3 flex items-center gap-3"
          >
            <SkeletonCircle className="w-8 h-8" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-2.5 w-1/3" />
            </div>
          </div>
        ))}
      </div>

      {/* Center logo + name */}
      <div className="wolvo-overlay absolute inset-0 z-10 flex bg-black/50 flex-col items-center justify-center pointer-events-none">
        <style>{`
          /* Black and white only. Every other colour in this scene is white, either with
             transparency (rgba) or mixed into black. */
          :root {
            --wolvo-black: #000000;
            --wolvo-white: #FFFFFF;

            /* ---- Opacity controls: change any value (0 to 1) to tune the scene ---- */
            --wolvo-planet-opacity: 0.2;                              /* master dial for every planet and the moon */
            --wolvo-planet-a-opacity: var(--wolvo-planet-opacity);   /* large gas giant (bottom-left) */
            --wolvo-planet-b-opacity: var(--wolvo-planet-opacity);   /* ringed planet (upper right) */
            --wolvo-planet-c-opacity: var(--wolvo-planet-opacity);   /* small planet (upper left) */
            --wolvo-moon-opacity: var(--wolvo-planet-opacity);       /* moon */
            --wolvo-asteroid-opacity: 1;      /* multiplies each asteroid's own opacity */
            --wolvo-star-opacity: 0.5;          /* multiplies each falling star's own opacity */
            --wolvo-shooting-star-opacity: 1;
            --wolvo-orbit-path-opacity: 1;    /* the faint orbit rings */
            --wolvo-orbit-particle-opacity: 1;
            --wolvo-satellite-opacity: .9;
            --wolvo-rocket-opacity: .9;

            /* soft white deepened into black (planetary shades) */
            --wolvo-gray-05: color-mix(in srgb, var(--wolvo-white) 5%, var(--wolvo-black));
            --wolvo-gray-08: color-mix(in srgb, var(--wolvo-white) 8%, var(--wolvo-black));
            --wolvo-gray-13: color-mix(in srgb, var(--wolvo-white) 13%, var(--wolvo-black));
            --wolvo-gray-19: color-mix(in srgb, var(--wolvo-white) 19%, var(--wolvo-black));
            --wolvo-gray-26: color-mix(in srgb, var(--wolvo-white) 26%, var(--wolvo-black));
            --wolvo-gray-35: color-mix(in srgb, var(--wolvo-white) 35%, var(--wolvo-black));
            /* white deepened into black (moon, asteroids, satellite) */
            --wolvo-white-08: color-mix(in srgb, var(--wolvo-white) 8%, var(--wolvo-black));
            --wolvo-white-16: color-mix(in srgb, var(--wolvo-white) 16%, var(--wolvo-black));
            --wolvo-white-30: color-mix(in srgb, var(--wolvo-white) 30%, var(--wolvo-black));
            --wolvo-white-48: color-mix(in srgb, var(--wolvo-white) 48%, var(--wolvo-black));
          }

          /* Soft fade-in so the overlay settles in instead of popping */
          .wolvo-overlay { animation: wolvo-fade-in .4s ease-out both; }
          @keyframes wolvo-fade-in {
            from { opacity: 0; }
            to   { opacity: 1; }
          }

          /* black space layer: #000000 dominates. A black vignette lets the edges recede
             and soft white only appears as a whisper of light in two corners. Nothing
             sits behind the logo, so it has no glow or halo. */
          .wolvo-space {
            position: absolute;
            inset: 0;
            z-index: -2;
            overflow: hidden;
            pointer-events: none;
            background:
              /* black vignette: depth without any visible blue */
              radial-gradient(ellipse 100% 100% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%),
              /* faint soft white haze hugging two outer corners (distant nebula light) */
              radial-gradient(ellipse 42% 38% at 4% 98%, rgba(255,255,255,.05), rgba(255,255,255,0) 70%),
              radial-gradient(ellipse 34% 30% at 98% 2%, rgba(255,255,255,.035), rgba(255,255,255,0) 70%),
              rgba(0,0,0,.78);
          }

          /* ---- Planets (sizes in vmin so they scale on any screen) ----
             All bodies share one light source (upper right). Each sphere is built
             from three layers: a flat-lit surface texture (soft bands / mottling),
             a shading layer (smooth terminator + limb darkening) and a thin lit
             rim on the sunward edge. Palette: black shadows, restrained soft white, white highlights. */
          @keyframes wolvo-float {
            from { transform: translate3d(0, 0, 0); }
            to   { transform: translate3d(1.2vmin, -1.4vmin, 0); }
          }

          /* Large banded gas giant, partly off the bottom-left corner. Soft
             latitude bands run almost horizontally; ::before carries a few faint
             storm marks that drift slowly across the disc; ::after is the
             shading that turns the flat texture into a sphere. */
          .wolvo-planet-a {
            position: absolute;
            width: 78vmin;
            height: 78vmin;
            left: -26vmin;
            bottom: -34vmin;
            opacity: var(--wolvo-planet-a-opacity);
            border-radius: 50%;
            overflow: hidden;
            background:
              /* fine, low-contrast ripples between the broad bands */
              repeating-linear-gradient(172deg,
                rgba(255,255,255,0) 0 1.2%, rgba(255,255,255,.045) 1.8% 2.4%, rgba(255,255,255,0) 3% 4.2%,
                rgba(0,0,0,0) 4.2% 5.6%, rgba(0,0,0,.07) 6.2% 6.9%, rgba(0,0,0,0) 7.5% 8.6%),
              /* delicate white hairlines riding the brightest bands */
              linear-gradient(172deg,
                rgba(255,255,255,0) 0 14%, rgba(255,255,255,.10) 15.4% 16%, rgba(255,255,255,0) 17.6% 38%,
                rgba(255,255,255,.15) 40% 41%, rgba(255,255,255,.05) 42.5% 43.4%, rgba(255,255,255,0) 45% 74%,
                rgba(255,255,255,.08) 75.5% 76.2%, rgba(255,255,255,0) 78% 100%),
              /* restrained cloud bands: black into deep soft white, never brighter than 44% soft white */
              linear-gradient(172deg,
                var(--wolvo-black) 0%, var(--wolvo-gray-08) 5%, var(--wolvo-gray-13) 10%, var(--wolvo-gray-19) 15%,
                var(--wolvo-gray-13) 20%, var(--wolvo-gray-08) 26%, var(--wolvo-gray-13) 32%, var(--wolvo-gray-19) 37%,
                var(--wolvo-gray-26) 41%, var(--wolvo-gray-19) 46%, var(--wolvo-gray-13) 52%, var(--wolvo-gray-08) 58%,
                var(--wolvo-gray-05) 64%, var(--wolvo-gray-13) 70%, var(--wolvo-gray-19) 76%, var(--wolvo-gray-08) 83%,
                var(--wolvo-gray-05) 90%, var(--wolvo-black) 100%);
            animation: wolvo-float 70s ease-in-out infinite alternate;
          }
          .wolvo-planet-a::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 200%;
            height: 100%;
            opacity: .45;
            background:
              radial-gradient(ellipse 9% 2.6% at 18% 36%, rgba(0,0,0,.40), transparent),
              radial-gradient(ellipse 13% 1.8% at 38% 53%, rgba(255,255,255,.18), transparent),
              radial-gradient(ellipse 7% 2.2% at 33% 71%, rgba(0,0,0,.28), transparent);
            background-size: 50% 100%;
            background-repeat: repeat-x;
            animation: wolvo-surface 260s linear infinite;
            will-change: transform;
          }
          .wolvo-planet-a::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background:
              /* soft sunlit sheen on the upper-right of the sphere */
              radial-gradient(circle at 78% 22%, rgba(255,255,255,.12) 0, rgba(255,255,255,.05) 24%, rgba(255,255,255,0) 42%),
              /* twilight scattering: a thin soft white band where day turns to night */
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0) 40%, rgba(255,255,255,.1) 54%, rgba(255,255,255,.035) 62%, rgba(255,255,255,0) 70%),
              /* terminator: light from the upper right fading smoothly into night */
              radial-gradient(circle at 80% 20%, rgba(0,0,0,0) 26%, rgba(0,0,0,.28) 46%, rgba(0,0,0,.68) 66%, rgba(0,0,0,.93) 85%, #000000 100%),
              /* limb darkening toward the edge of the disc */
              radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 68%, rgba(0,0,0,.38) 100%);
            box-shadow:
              inset -.3vmin .3vmin .5vmin rgba(255,255,255,.16),
              inset -.5vmin .5vmin 1.6vmin rgba(255,255,255,.18),
              inset -1.2vmin 1.2vmin 3vmin rgba(255,255,255,.07);
          }
          @keyframes wolvo-surface {
            from { transform: translate3d(0, 0, 0); }
            to   { transform: translate3d(-50%, 0, 0); }
          }

          /* Small ringed planet (upper right). The ring is a thin, tilted ellipse
             (two ringlets with a gap): its back half sits behind the sphere
             (z-index 0 < sphere 1), its front half (the lower half of the
             ellipse, clipped) crosses in front of it (z-index 2). */
          .wolvo-planet-b {
            position: absolute;
            width: 14vmin;
            height: 14vmin;
            right: 9%;
            top: 9%;
            opacity: var(--wolvo-planet-b-opacity);
            animation: wolvo-float 55s ease-in-out -18s infinite alternate;
          }
          .wolvo-planet-b::before,
          .wolvo-planet-b::after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            width: 250%;
            height: 250%;
            border-radius: 50%;
            background: radial-gradient(closest-side,
              rgba(0,0,0,0) 0 60%,
              rgba(255,255,255,.05) 60% 61.2%,
              rgba(255,255,255,.22) 61.2% 67.5%,
              rgba(0,0,0,0) 67.5% 69%,
              rgba(255,255,255,.17) 69% 74%,
              rgba(255,255,255,.05) 74% 74.8%,
              rgba(0,0,0,0) 74.8% 100%);
            transform: translate(-50%, -50%) rotate(-20deg) scaleY(.17);
          }
          .wolvo-planet-b::before { z-index: 0; }
          .wolvo-planet-b::after  { z-index: 2; clip-path: inset(50% 0 0 0); }
          .wolvo-sphere {
            position: absolute;
            inset: 0;
            z-index: 1;
            border-radius: 50%;
            overflow: hidden;
            background:
              /* soft bands parallel to the ring plane */
              repeating-linear-gradient(160deg,
                rgba(0,0,0,0) 0 7%, rgba(255,255,255,.05) 9% 12%, rgba(0,0,0,0) 14% 21%,
                rgba(0,0,0,.14) 23% 27%, rgba(0,0,0,0) 29% 36%),
              /* a soft white reflection near the lit top edge */
              linear-gradient(160deg, rgba(255,255,255,0) 5%, rgba(255,255,255,.14) 11%, rgba(255,255,255,0) 18%),
              /* dark soft white body fading into black, bands parallel to the ring */
              linear-gradient(160deg,
                var(--wolvo-gray-35) 0%, var(--wolvo-gray-26) 16%, var(--wolvo-gray-19) 32%, var(--wolvo-gray-26) 46%,
                var(--wolvo-gray-13) 62%, var(--wolvo-gray-08) 80%, var(--wolvo-black) 100%);
          }
          .wolvo-sphere::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background:
              radial-gradient(circle at 74% 24%, rgba(0,0,0,0) 18%, rgba(0,0,0,.30) 42%, rgba(0,0,0,.72) 68%, rgba(0,0,0,.96) 100%),
              /* soft shadow the ring throws across the lower half */
              linear-gradient(-20deg, rgba(0,0,0,0) 55%, rgba(0,0,0,.30) 59% 64%, rgba(0,0,0,0) 69%);
            box-shadow:
              inset -.25vmin .25vmin .4vmin rgba(255,255,255,.18),
              inset -.5vmin .5vmin 1vmin rgba(255,255,255,.13);
          }

          /* Small distant rocky planet (upper left) and a tiny cratered moon
             near the big planet. Both are lit from the upper right. */
          .wolvo-planet-c,
          .wolvo-moon {
            position: absolute;
            border-radius: 50%;
          }
          .wolvo-planet-c {
            width: 6.5vmin;
            height: 6.5vmin;
            left: 8%;
            top: 15%;
            opacity: var(--wolvo-planet-c-opacity);
            background:
              radial-gradient(ellipse 34% 24% at 38% 62%, rgba(0,0,0,.26), transparent),
              radial-gradient(ellipse 22% 16% at 64% 38%, rgba(0,0,0,.20), transparent),
              radial-gradient(ellipse 26% 14% at 30% 30%, rgba(255,255,255,.10), transparent),
              /* dark soft white rocky world fading into black */
              linear-gradient(200deg, var(--wolvo-gray-35) 0%, var(--wolvo-gray-26) 28%, var(--wolvo-gray-19) 52%, var(--wolvo-gray-08) 78%, var(--wolvo-black) 100%);
            animation: wolvo-float 48s ease-in-out -30s infinite alternate;
          }
          .wolvo-moon {
            width: 3.4vmin;
            height: 3.4vmin;
            left: 40vmin;
            bottom: 42vmin;
            opacity: var(--wolvo-moon-opacity);
            background:
              /* craters: dark floor, faint lit rim on the side away from the light */
              radial-gradient(circle at 36% 62%, rgba(0,0,0,.34) 0 7%, rgba(255,255,255,.12) 9%, rgba(0,0,0,0) 12%),
              radial-gradient(circle at 60% 44%, rgba(0,0,0,.28) 0 5%, rgba(255,255,255,.10) 6.5%, rgba(0,0,0,0) 8.5%),
              radial-gradient(circle at 46% 28%, rgba(0,0,0,.20) 0 3%, rgba(0,0,0,0) 5%),
              linear-gradient(200deg, var(--wolvo-white-48) 0%, var(--wolvo-white-30) 50%, var(--wolvo-white-16) 100%);
            animation: wolvo-float 40s ease-in-out -10s infinite alternate;
          }
          .wolvo-planet-c::after,
          .wolvo-moon::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background:
              radial-gradient(circle at 74% 24%, rgba(0,0,0,0) 30%, rgba(0,0,0,.38) 54%, rgba(0,0,0,.78) 78%, rgba(0,0,0,.96) 100%),
              radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 72%, rgba(0,0,0,.28) 100%);
            box-shadow: inset -.2vmin .2vmin .3vmin rgba(255,255,255,.18);
          }
          /* gentle soft white atmosphere on the small planet only; the moon stays neutral */
          .wolvo-planet-c::after {
            box-shadow:
              inset -.2vmin .2vmin .3vmin rgba(255,255,255,.22),
              inset -.45vmin .45vmin .8vmin rgba(255,255,255,.15);
          }

          /* ---- Asteroids: irregular clip-path shapes with a thin white rim light,
             travelling across the screen while they tumble ---- */
          .wolvo-rock {
            position: absolute;
            top: 0;
            left: 0;
            width: var(--s);
            height: var(--s);
            opacity: calc(var(--o) * var(--wolvo-asteroid-opacity));
            animation: wolvo-rock var(--d) linear var(--dl) infinite;
            will-change: transform;
          }
          .wolvo-rock::before {
            content: "";
            position: absolute;
            inset: 0;
            clip-path: var(--clip);
            background:
              radial-gradient(circle at 62% 58%, rgba(0,0,0,.55) 0 14%, transparent 16%),
              radial-gradient(circle at 34% 66%, rgba(0,0,0,.40) 0 9%, transparent 11%),
              linear-gradient(135deg, var(--rim, rgba(255,255,255,.6)) 0, rgba(255,255,255,.16) 12%, var(--wolvo-white-08) 34%, var(--wolvo-black) 62%, var(--wolvo-black) 100%);
            animation: wolvo-tumble var(--r) linear infinite;
            animation-direction: var(--rd);
          }
          /* roughly one asteroid in four catches a thin soft white rim light */
          .wolvo-rock:nth-child(4n+2) { --rim: rgba(255,255,255,.45); }
          @keyframes wolvo-rock {
            from { transform: translate3d(var(--x0), var(--y0), 0); }
            to   { transform: translate3d(var(--x1), var(--y1), 0); }
          }
          @keyframes wolvo-tumble {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }

          /* ---- Satellite: elliptical path from two eased translations
             (x and y, a quarter-period apart), so the craft is never squashed ---- */
          .wolvo-sat-x {
            position: absolute;
            left: var(--cx);
            top: var(--cy);
            width: 0;
            height: 0;
            animation: wolvo-sat-x var(--D) cubic-bezier(.37, 0, .63, 1) infinite alternate;
          }
          .wolvo-sat-y {
            position: absolute;
            left: 0;
            top: 0;
            width: 0;
            height: 0;
            animation: wolvo-sat-y var(--D) cubic-bezier(.37, 0, .63, 1) calc(var(--D) * -.5) infinite alternate;
          }
          @keyframes wolvo-sat-x {
            from { transform: translate3d(calc(var(--a) * -1), 0, 0); }
            to   { transform: translate3d(var(--a), 0, 0); }
          }
          @keyframes wolvo-sat-y {
            from { transform: translate3d(0, calc(var(--b) * -1), 0); }
            to   { transform: translate3d(0, var(--b), 0); }
          }
          .wolvo-sat {
            --u: clamp(3px, .85vmin, 9px);
            position: absolute;
            left: calc(var(--u) * -.8);
            top: calc(var(--u) * -.8);
            width: calc(var(--u) * 1.6);
            height: calc(var(--u) * 1.6);
            border-radius: 15%;
            background: linear-gradient(135deg, var(--wolvo-white) 0, var(--wolvo-white-48) 45%, var(--wolvo-white-16) 100%);
            opacity: var(--wolvo-satellite-opacity);
            animation: wolvo-sat-tilt 14s ease-in-out infinite alternate;
          }
          .wolvo-sat::before,
          .wolvo-sat::after {
            content: "";
            position: absolute;
            top: 50%;
            width: calc(var(--u) * 2);
            height: calc(var(--u) * .9);
            margin-top: calc(var(--u) * -.45);
            border: 1px solid rgba(255,255,255,.30);
            background:
              repeating-linear-gradient(90deg, rgba(255,255,255,.28) 0 1px, transparent 1px calc(var(--u) * .5)),
              linear-gradient(90deg, var(--wolvo-gray-13), var(--wolvo-gray-35));
          }
          .wolvo-sat::before { right: calc(100% + var(--u) * .3); }
          .wolvo-sat::after  { left:  calc(100% + var(--u) * .3); }
          @keyframes wolvo-sat-tilt {
            from { transform: rotate(-12deg); }
            to   { transform: rotate(16deg); }
          }

          /* ---- Rocket: tiny, distant, one slow crossing near the bottom ---- */
          .wolvo-rocket {
            --w: clamp(16px, 3.4vmin, 34px);
            position: absolute;
            top: 0;
            left: 0;
            width: var(--w);
            height: calc(var(--w) * .34);
            opacity: var(--wolvo-rocket-opacity);
            animation: wolvo-rocket 140s linear -45s infinite;
            will-change: transform;
          }
          .wolvo-rocket::before {
            content: "";
            position: absolute;
            right: 96%;
            top: 50%;
            width: 70%;
            height: 34%;
            border-radius: 50%;
            transform-origin: 100% 50%;
            transform: translateY(-50%);
            background: linear-gradient(270deg, rgba(255,255,255,.9), rgba(255,255,255,.4) 40%, rgba(255,255,255,0));
            animation: wolvo-flame .16s ease-in-out infinite alternate;
          }
          .wolvo-rocket-body {
            position: absolute;
            inset: 0;
            clip-path: polygon(0 0, 24% 32%, 74% 32%, 100% 50%, 74% 68%, 24% 68%, 0 100%, 12% 50%);
            background: linear-gradient(180deg, rgba(255,255,255,.95), var(--wolvo-white-48) 45%, var(--wolvo-white-16) 100%);
          }
          @keyframes wolvo-rocket {
            from { transform: translate3d(-8vw, 90vh, 0) rotate(-6deg); }
            to   { transform: translate3d(108vw, 76vh, 0) rotate(-6deg); }
          }
          @keyframes wolvo-flame {
            from { transform: translateY(-50%) scaleX(.75); opacity: .7; }
            to   { transform: translateY(-50%) scaleX(1.1); opacity: 1; }
          }

          /* ---- Falling stars ----
             The wrapper falls and fades in/out (transform + opacity, so it loops
             invisibly: opacity is 0 at both ends). The ::before dot twinkles
             independently. All per-star values come from CSS variables. */
          .wolvo-star {
            position: absolute;
            top: -12px;
            left: var(--x);
            width: var(--s);
            height: calc(var(--s) * var(--l));
            opacity: calc(var(--o) * var(--wolvo-star-opacity));
            animation: wolvo-fall var(--d) linear var(--dl) infinite;
            will-change: transform, opacity;
          }
          .wolvo-star::before {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            background: var(--c);
            box-shadow:
              0 0 calc(var(--s) * 3) calc(var(--s) * .3) var(--c),
              0 0 calc(var(--s) * 5) var(--c);
          }
          .wolvo-star-tw::before {
            animation: wolvo-tw var(--t) ease-in-out var(--tl) infinite;
          }
          @keyframes wolvo-fall {
            0%   { transform: translate3d(0, 0, 0); opacity: 0; }
            12%  { opacity: calc(var(--o) * var(--wolvo-star-opacity) * .6); }
            45%  { opacity: calc(var(--o) * var(--wolvo-star-opacity)); }
            88%  { opacity: calc(var(--o) * var(--wolvo-star-opacity) * .5); }
            100% { transform: translate3d(var(--dx), calc(100vh + 24px), 0); opacity: 0; }
          }
          @keyframes wolvo-tw {
            0%, 100% { opacity: 1; }
            50%      { opacity: .35; }
          }

          /* ---- Shooting stars: rare, travel only in the first ~7% of a long cycle ---- */
          .wolvo-shoot {
            position: absolute;
            top: var(--y);
            left: var(--x);
            width: var(--w);
            height: 3px;
            opacity: 0;
            background:
              radial-gradient(circle at 100% 50%, #FFFFFF 0, rgba(255,255,255,0) 4px),
              linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.85));
            animation: wolvo-shoot var(--d) linear var(--dl) infinite;
            will-change: transform, opacity;
          }
          @keyframes wolvo-shoot {
            0%   { opacity: 0; transform: translate3d(0, 0, 0) rotate(var(--r)); }
            1.5% { opacity: var(--wolvo-shooting-star-opacity); }
            7%   { opacity: 0; transform: translate3d(var(--tx), var(--ty), 0) rotate(var(--r)); }
            100% { opacity: 0; transform: translate3d(var(--tx), var(--ty), 0) rotate(var(--r)); }
          }

          /* ---- Orbits: tilted + flattened wrapper = ellipse; the spinner rotates the dot ---- */
          .wolvo-orbit {
            position: absolute;
            left: var(--cx);
            top: var(--cy);
            width: 0;
            height: 0;
            transform: rotate(var(--tilt)) scaleY(var(--e));
          }
          .wolvo-orbit::before {
            content: "";
            position: absolute;
            left: calc(var(--r) * -1);
            top: calc(var(--r) * -1);
            width: calc(var(--r) * 2);
            height: calc(var(--r) * 2);
            border-radius: 9999px;
            border: 1px solid rgba(255,255,255,.04);
            opacity: var(--wolvo-orbit-path-opacity);
          }
          .wolvo-orbit-spin {
            position: absolute;
            left: 0;
            top: 0;
            width: 0;
            height: 0;
            animation: wolvo-spin var(--d) linear var(--dl) infinite;
            animation-direction: var(--dir);
            will-change: transform;
          }
          @keyframes wolvo-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          .wolvo-orb {
            position: absolute;
            left: var(--r);
            top: 0;
            width: var(--s);
            height: var(--s);
            margin: calc(var(--s) * -.5) 0 0 calc(var(--s) * -.5);
            border-radius: 9999px;
            background: var(--c);
            box-shadow:
              0 0 calc(var(--s) * 2.5) calc(var(--s) * .2) var(--c),
              0 0 calc(var(--s) * 5) var(--c);
            opacity: .12;
            animation: wolvo-orb var(--g) ease-in-out var(--gl) infinite;
          }
          @keyframes wolvo-orb {
            0%, 100% { opacity: .12; }
            50%      { opacity: calc(var(--o) * .65 * var(--wolvo-orbit-particle-opacity)); }
          }

          .wolvo-logo { animation: wolvo-bob 2.6s ease-in-out infinite; }
          @keyframes wolvo-bob {
            0%, 100% { transform: translateY(0) rotate(-1.5deg); }
            50%      { transform: translateY(-8px) rotate(1.5deg); }
          }

          .wolvo-waves path { opacity: 0; animation: wolvo-wave 1.8s ease-out infinite; }
          .wolvo-waves path:nth-child(2) { animation-delay: 0s; }
          .wolvo-waves path:nth-child(1) { animation-delay: .25s; }
          .wolvo-waves path:nth-child(3) { animation-delay: .5s; }
          .wolvo-waves path:nth-child(4) { animation-delay: .75s; }
          @keyframes wolvo-wave {
            0%   { opacity: 0; transform: translateX(-40px); }
            25%  { opacity: 1; }
            70%  { opacity: 0; transform: translateX(30px); }
            100% { opacity: 0; transform: translateX(30px); }
          }

          /* Status line gently breathes with the logo */
          .wolvo-status { animation: wolvo-status 2.6s ease-in-out infinite; }
          @keyframes wolvo-status {
            0%, 100% { opacity: .7; }
            50%      { opacity: 1; }
          }

          @media (prefers-reduced-motion: reduce) {
            .wolvo-overlay, .wolvo-logo, .wolvo-status,
            .wolvo-planet-a, .wolvo-planet-a::before, .wolvo-planet-b, .wolvo-planet-c, .wolvo-moon,
            .wolvo-rock, .wolvo-rock::before, .wolvo-sat-x, .wolvo-sat-y, .wolvo-sat,
            .wolvo-star, .wolvo-star::before, .wolvo-shoot, .wolvo-orbit-spin, .wolvo-orb,
            .wolvo-waves path { animation: none !important; }
            .wolvo-star { transform: translate3d(0, var(--y), 0); }
            .wolvo-rock { transform: translate3d(calc((var(--x0) + var(--x1)) / 2), calc((var(--y0) + var(--y1)) / 2), 0); }
            .wolvo-orb { opacity: .5; }
            .wolvo-shoot, .wolvo-rocket { display: none; }
            .wolvo-waves path { opacity: 1; }
          }
        `}</style>

        {/* Deep-space atmosphere: decorative, behind everything in the overlay */}
        <div className="wolvo-space" aria-hidden="true">
          {/* depth order: far clouds and stars, then planets and nearer objects */}
          {STARS.map((star, i) => (
            <span key={i} className={star.className} style={star.style} />
          ))}
          {SHOOTERS.map((shooter, i) => (
            <span key={i} className="wolvo-shoot" style={shooter} />
          ))}
          {ORBITS.map((orbit, i) => (
            <div key={i} className="wolvo-orbit" style={orbit}>
              <span className="wolvo-orbit-spin">
                <i className="wolvo-orb" />
              </span>
            </div>
          ))}
          <div className="wolvo-planet-a" />
          <div className="wolvo-planet-b">
            <i className="wolvo-sphere" />
          </div>
          <div className="wolvo-planet-c" />
          <div className="wolvo-moon" />
          {ROCKS.map((rock, i) => (
            <span key={i} className="wolvo-rock" style={rock} />
          ))}
          <div className="wolvo-sat-x" style={SATELLITE}>
            <div className="wolvo-sat-y">
              <div className="wolvo-sat" />
            </div>
          </div>
          <div className="wolvo-rocket">
            <i className="wolvo-rocket-body" />
          </div>
        </div>

        <svg
          className="wolvo-logo w-24 h-24 pb-4 overflow-visible"
          viewBox="0 0 1297 1301"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
        >
          <path
            className="wolvo-body"
            fill="white"
            d="M1224.98 3.74188C1235.84 -1.41485 1237.2 -1.41552 1247.24 4.82684C1266.78 16.4974 1281.71 50.9664 1284.96 91.1345C1285.78 101.177 1289.03 122.075 1292.02 137.546C1296.63 160.615 1297.45 172.557 1296.36 201.326C1294.19 252.893 1284.96 284.919 1237.19 407.867C1234.48 414.652 1234.75 417.909 1239.91 429.037C1244.52 439.35 1246.69 441.792 1250.22 440.164C1252.67 439.078 1261.35 435.822 1269.49 432.837C1283.61 427.408 1284.15 427.408 1287.68 432.022C1297.72 446.135 1298.8 483.047 1289.58 511.002C1279.81 541.128 1266.51 553.884 1203.54 592.695C1097.15 658.647 1020.61 743.597 980.443 839.947C942.446 931.682 929.962 1021.79 938.918 1140.94C940.818 1163.46 941.361 1185.18 940.275 1188.98C937.019 1202 923.177 1213.95 893.322 1229.42C830.084 1262.26 767.117 1283.43 695.737 1295.91C656.655 1302.7 549.992 1302.7 508.467 1295.91C471.013 1289.67 423.516 1278 391.762 1266.87C319.839 1241.63 216.705 1179.75 206.662 1156.14C202.048 1144.74 202.862 1141.48 222.403 1107.55C266.1 1031.29 312.51 925.983 338.837 842.389L342.094 831.804L364.35 833.705C444.686 840.219 503.581 838.047 558.948 826.92C670.496 804.664 765.489 743.326 823.027 656.205C842.297 627.436 862.653 586.182 862.653 576.411C862.653 575.054 854.239 582.925 843.926 594.052C789.916 652.676 748.933 686.331 695.194 716.457C626.257 754.996 553.792 775.624 470.47 779.966C435.73 781.866 371.948 779.152 365.978 775.624C360.007 771.823 380.633 651.862 399.903 580.211C424.059 490.103 459.885 414.923 503.581 361.999C507.109 357.657 509.552 353.586 508.738 353.043C506.838 350.871 476.983 372.312 459.07 388.868C403.703 439.35 360.55 522.943 333.681 630.421C330.695 642.363 323.91 670.861 318.753 693.93C306.268 747.94 293.512 788.38 272.071 841.304C251.716 892.329 210.19 974.836 185.221 1014.46C175.45 1030.2 164.051 1048.12 160.251 1054.36C149.666 1071.46 132.839 1076.61 119.269 1066.84C109.226 1059.79 76.9287 1008.49 56.3018 966.966C29.704 912.684 4.46383 833.162 0.392578 790.28C-1.50727 768.296 2.29265 759.882 38.9326 709.129C55.217 686.602 73.6727 661.09 79.915 652.133C86.4288 643.177 106.513 615.765 124.697 591.067C142.881 566.369 160.25 542.485 162.965 537.871L168.122 529.186L144.781 501.231C110.313 459.163 94.028 435.55 75.8438 401.082C37.304 327.259 19.662 267.549 29.4326 242.58C32.4181 234.709 44.9033 227.381 55.2168 227.381C59.289 227.381 99.1854 234.166 144.238 242.58C260.672 264.021 343.18 275.148 360.55 272.163C372.763 269.72 381.72 265.106 438.715 230.909C565.733 154.644 673.482 110.676 744.319 106.062C776.617 104.162 806.472 107.962 863.467 121.803C932.947 138.631 937.833 137.817 1014.64 101.991C1063.49 78.9213 1158.49 34.6815 1186.98 21.3825C1203.54 13.7833 1220.64 5.91333 1224.98 3.74188ZM1243.17 227.381C1237.2 227.381 1225.52 237.694 1181.29 282.748C1102.03 362.813 1084.66 383.441 1068.92 416.009C1049.38 455.905 1037.98 493.359 1045.04 493.36C1055.35 493.089 1190.51 462.148 1200.55 457.534C1205.44 455.363 1208.15 451.021 1210.05 443.422C1213.04 430.665 1233.67 358.742 1245.61 318.302C1254.84 287.362 1259.18 243.395 1253.75 233.352C1251.58 229.553 1248.05 227.381 1243.17 227.381ZM887.079 202.683C887.079 201.326 885.451 200.511 883.822 200.783C881.922 200.783 875.951 201.598 870.795 202.14C858.581 203.226 815.428 210.282 789.373 215.439C756.804 221.953 742.691 227.653 705.236 249.908C675.381 267.821 607.802 321.016 611.059 324.273C613.23 326.173 667.782 317.217 706.051 308.532C760.604 296.047 780.417 288.719 804.301 272.706C828.184 256.422 887.076 206.757 887.079 202.683ZM376.022 53.9518C386.607 47.7095 400.45 50.6951 427.048 64.8083C457.989 80.8215 526.111 122.346 536.425 131.031L543.481 137.274L520.683 148.673C490.014 164.143 436.546 194.27 407.234 212.454C394.207 220.596 382.537 226.023 381.451 224.938C380.094 223.581 376.294 212.996 372.766 201.054C355.124 140.26 356.753 65.0803 376.022 53.9518Z"
          />

          {/* sound waves, mapped from the HTML logo into this viewBox */}
          <g
            className="wolvo-waves"
            fill="white"
            transform="scale(0.8917) translate(-559 -617)"
          >
            <path d="M2175.57 1116.41C2190.59 1032.13 2174.2 945.273 2129.51 872.262L2080.16 902.47C2117.47 963.411 2131.15 1035.91 2118.61 1106.26L2175.57 1116.41Z" />
            <path d="M2070.87 1089.85C2079.52 1041.34 2070.09 991.328 2044.35 949.295L2015.95 966.686C2037.42 1001.77 2045.3 1043.51 2038.08 1084.01L2070.87 1089.85Z" />
            <path d="M2299.8 1169.05C2325.25 1026.26 2297.48 879.091 2221.76 755.389L2152.14 798.009C2217.44 904.683 2241.38 1031.59 2219.44 1154.72L2299.8 1169.05Z" />
            <path d="M2510.08 1233.79C2551.36 1002.15 2506.32 763.407 2383.47 562.73L2256.57 640.417C2360.41 810.055 2398.49 1011.87 2363.59 1207.68L2510.08 1233.79Z" />
          </g>
        </svg>
        <div className="text-center" role="status" aria-live="polite">
          <h1 className="text-white text-2xl font-normal tracking-wide">
            Wolvo
          </h1>
          <p className="wolvo-status mt-1 text-sm font-normal text-white/50">
            Getting things ready...
          </p>
        </div>
      </div>
    </div>
  );
}