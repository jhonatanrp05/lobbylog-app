const API_URL = "http://localhost:3000";

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

export const loginRequest = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};

export const getUsersRequest = async (token: string) => {
  const res = await fetch(`${API_URL}/users`, {
    headers: getHeaders(token),
  });

  return res.json();
};

export const createUserRequest = async (token: string, data: object) => {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });

  return res.json();
};

export const deleteUserRequest = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });

  return res.json();
};

export const getPackagesRequest = async (token: string) => {
  const res = await fetch(`${API_URL}/packages`, {
    headers: getHeaders(token),
  });

  return res.json();
};

export const getMyPackagesRequest = async (token: string) => {
  const res = await fetch(`${API_URL}/packages/my`, {
    headers: getHeaders(token),
  });

  return res.json();
};

export const getLoggedPackagesRequest = async (token: string) => {
  const res = await fetch(`${API_URL}/packages/my-logged`, {
    headers: getHeaders(token),
  });

  return res.json();
};

export const createPackageRequest = async (token: string, data: object) => {
  const res = await fetch(`${API_URL}/packages`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(data),
  });

  return res.json();
};

export const deliverPackageRequest = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/packages/${id}/deliver`, {
    method: "PATCH",
    headers: getHeaders(token),
  });

  return res.json();
};

export const confirmPackageRequest = async (token: string, id: string) => {
  const res = await fetch(`${API_URL}/packages/${id}/confirm`, {
    method: "PATCH",
    headers: getHeaders(token),
  });

  return res.json();
};
