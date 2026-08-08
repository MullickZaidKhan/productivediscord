import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../../components/layout/Sidebar";
import UserPanel from "../../components/layout/UserPanel";
import { useSelector } from "react-redux";
import Chat from "../../components/chat/Chat";
import Profile from "../../components/Profile/Profile.jsx";
import { scaleIn } from "../../components/ui/motion.js";
import { useGetUserBackground } from "../../hooks/background.hook.js";
import DiscordAccountSettings from "../../components/settings/DiscordAccountSettings.jsx";

export {
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
};