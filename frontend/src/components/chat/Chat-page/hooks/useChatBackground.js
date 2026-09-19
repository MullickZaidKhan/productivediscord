import { useGetUserBackground } from "../../../../hooks/background.hook.js";

const fallbackBackground =
  "https://i.pinimg.com/1200x/62/7e/3a/627e3aa8f4209d6cbcfcd831a30f935e.jpg";

export default function useChatBackground() {
  const { data: backgroundData } = useGetUserBackground();
  const backgrounds = backgroundData?.data || [];
  const bgimg = backgrounds.imageUrl || fallbackBackground;

  return { bgimg };
}
