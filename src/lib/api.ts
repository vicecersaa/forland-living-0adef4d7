const API_URL = import.meta.env.VITE_API_URL;

export async function api<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request gagal");
  }

  return data;
}

export async function getProducts() {

  const res = await fetch(
    "https://API-RAILWAY-LU/products"
  );

  const json = await res.json();

  return json.data.items;

}