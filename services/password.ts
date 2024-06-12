export const postPassword = async (password: string) => {
  const url = `/api/password/`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: password }),
  });

  if (!res.ok) {
    throw new Error("Failed to POST data");
  }

  return await res.json();
};
