// export function setAuthCookies(res, accessToken, refreshToken) {
//   const isProd = process.env.NODE_ENV === "production";

//   res.cookie("accessToken", accessToken, {
//     httpOnly: true,
//     secure: isProd,
//     sameSite: isProd ? "none" : "lax",
//     maxAge: 15 * 60 * 1000, // 15min
//   });

//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,
//     secure: isProd,
//     sameSite: isProd ? "none" : "lax",
//     maxAge: 30 * 24 * 60 * 60 * 1000, // 30day
//   });
// }

// export function clearAuthCookies(res) {
//   res.clearCookie("accessToken");
//   res.clearCookie("refreshToken");
// }

const isProd = process.env.NODE_ENV === "production";

const authCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
};

export function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie("accessToken", accessToken, {
    ...authCookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    ...authCookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

export function clearAuthCookies(res) {
  res.clearCookie("accessToken", authCookieOptions);
  res.clearCookie("refreshToken", authCookieOptions);
}
