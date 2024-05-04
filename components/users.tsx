import React, { useEffect } from "react";

type TUser = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
};

const Users: React.FC = () => {
  console.log("FIND_ME_Users");
  const [users, setUsers] = React.useState<TUser[]>([]);

  // Fetch data from external API
  useEffect(() => {
    try {
      fetch("https://api.escuelajs.co/api/v1/users?limit=4", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          SECRET_API_KEY: `${process.env.NEXT_PUBLIC_SECRET_API_KEY}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setUsers(data));
    } catch ({ message }) {
      console.error(message);
    }
  }, []);

  return (
    <div style={{ width: "20vw" }}>
      <h2>Restricted Access Area</h2>
      <h3>Users</h3>
      {users.map(({ id, name, email, role }: TUser) => (
        <div key={id}>
          <h4>ID: {id}</h4>
          <p>Name: {name}</p>
          <p>Email: {email}</p>
          <p>Role: {role}</p>
        </div>
      ))}
    </div>
  );
};

export default Users;
