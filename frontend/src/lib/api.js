import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const TOKEN_KEY = "ns_admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const authHeaders = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

export const adminApi = {
  login: async (mobile, password) => {
    const { data } = await axios.post(`${API}/admin/login`, { mobile, password });
    setToken(data.token);
    return data;
  },
  me: async () => {
    const { data } = await axios.get(`${API}/admin/me`, { headers: authHeaders() });
    return data;
  },
  listUsers: async () => {
    const { data } = await axios.get(`${API}/admin/users`, { headers: authHeaders() });
    return data;
  },
  history: async () => {
    const { data } = await axios.get(`${API}/admin/users/history`, { headers: authHeaders() });
    return data;
  },
  addUser: async (payload) => {
    const { data } = await axios.post(`${API}/admin/users`, payload, { headers: authHeaders() });
    return data;
  },
  removeUser: async (id) => {
    const { data } = await axios.delete(`${API}/admin/users/${id}`, { headers: authHeaders() });
    return data;
  },
};

export const publicApi = {
  checkAuthorized: async (mobile) => {
    const { data } = await axios.get(`${API}/check-authorized/${mobile}`);
    return data;
  },
};

export function formatErr(e) {
  const d = e?.response?.data?.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((x) => x.msg || JSON.stringify(x)).join(", ");
  return e?.message || "Something went wrong.";
}
