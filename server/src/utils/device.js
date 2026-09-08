// server/src/utils/device.js

export const getBrowserName = (userAgent = "") => {
  if (userAgent.includes("Edg/")) {
    return "Microsoft Edge";
  }

  if (userAgent.includes("OPR/")) {
    return "Opera";
  }

  if (userAgent.includes("Chrome/")) {
    return "Google Chrome";
  }

  if (userAgent.includes("Firefox/")) {
    return "Mozilla Firefox";
  }

  if (userAgent.includes("Safari/")) {
    return "Safari";
  }

  return "Unknown Browser";
};

export const getOSName = (userAgent = "") => {
  if (userAgent.includes("Windows NT")) {
    return "Windows";
  }

  if (userAgent.includes("Mac OS X")) {
    return "macOS";
  }

  if (userAgent.includes("Android")) {
    return "Android";
  }

  if (
    userAgent.includes("iPhone") ||
    userAgent.includes("iPad")
  ) {
    return "iOS";
  }

  if (userAgent.includes("Linux")) {
    return "Linux";
  }

  return "Unknown OS";
};