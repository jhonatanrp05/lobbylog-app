const API_URL = "http://localhost:3000";

const getHeaders = () => ({
  "Content-Type": "application/json",
});

export const loginRequest = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const logoutRequest = async () => {
  const res = await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};

export const getUsersRequest = async () => {
  const res = await fetch(`${API_URL}/users`, {
    credentials: "include",
    headers: getHeaders(),
  });
  return res.json();
};

export const getResidentsRequest = async () => {
  const res = await fetch(`${API_URL}/users/residents`, {
    credentials: "include",
    headers: getHeaders(),
  });
  return res.json();
};

export const createUserRequest = async (data: object) => {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    credentials: "include",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteUserRequest = async (id: string) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: getHeaders(),
  });
  return res.json();
};

export const getPackagesRequest = async () => {
  const res = await fetch(`${API_URL}/packages`, {
    credentials: "include",
    headers: getHeaders(),
  });
  return res.json();
};

export const getMyPackagesRequest = async () => {
  const res = await fetch(`${API_URL}/packages/my`, {
    credentials: "include",
    headers: getHeaders(),
  });
  return res.json();
};

export const getLoggedPackagesRequest = async () => {
  const res = await fetch(`${API_URL}/packages/my-logged`, {
    credentials: "include",
    headers: getHeaders(),
  });
  return res.json();
};

export const createPackageRequest = async (data: object) => {
  const res = await fetch(`${API_URL}/packages`, {
    method: "POST",
    credentials: "include",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deliverPackageRequest = async (id: string) => {
  const res = await fetch(`${API_URL}/packages/${id}/deliver`, {
    method: "PATCH",
    credentials: "include",
    headers: getHeaders(),
  });
  return res.json();
};

export const confirmPackageRequest = async (id: string) => {
  const res = await fetch(`${API_URL}/packages/${id}/confirm`, {
    method: "PATCH",
    credentials: "include",
    headers: getHeaders(),
  });
  return res.json();
};
