const BASE_URL = "http://localhost:3000";

export const addUser = async (data) => {
  const res = await fetch(`${BASE_URL}/add-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return res.text();
};

export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}/users`);
  return res.json();
};