import { useSelector } from "react-redux";

export default function useContactOnline(contactId) {
  const onlineFriends = useSelector(
    (state) => state.onlineFriendsslice?.ONLINE_USERS || [],
  );

  return onlineFriends.some(
    (person) => String(person.id) === String(contactId),
  );
}
