import {api} from "../api/axios";

// All the post
export const login = (body) =>
    api.post("auth/login", body);

export const register = (body) =>
    api.post("auth/register", body);

export const logout = () =>
    api.post("auth/logout");

// All the get
export const refreshToken = () =>
    api.get("auth/refresh");

export const accesstoken = () =>
    api.get("auth/accesstoken");

export const refreshtoken = () =>
    api.get("auth/refresh");

