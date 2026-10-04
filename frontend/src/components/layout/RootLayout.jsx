import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { pageVariants } from "../ui/motion.js";

export default function RootLayout() {
  const location = useLocation();
  const pageKey =
    ["/Online", "/All", "/Add_Friend", "/Pending"].includes(
      location.pathname,
    ) ||
    location.pathname.startsWith("/channels/@me/")
      ? "/"
      : location.pathname;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pageKey}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
