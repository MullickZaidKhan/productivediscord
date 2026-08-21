const onlineUsers = new Map();

export function addConnection(userId, socketId) {
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  onlineUsers.get(userId).add(socketId);
  return onlineUsers.get(userId).size === 1;
}

export function removeConnection(userId, socketId) {
  const sockets = onlineUsers.get(userId);
  if (!sockets) return true;
  sockets.delete(socketId);
  if (sockets.size === 0) {
    onlineUsers.delete(userId);
    return true;
  }
  return false;
}

export function isOnline(userId) {
  const sockets = onlineUsers.get(userId);
  return sockets !== undefined && sockets.size > 0;
}

export function getOnlineSocketIds(userId) {
  const sockets = onlineUsers.get(userId);
  return sockets ? [...sockets] : [];
}
