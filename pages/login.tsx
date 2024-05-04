import React from "react";
import { TCreds, TRole } from "../types";

const auth = async ({ email, password }: TCreds) => {
  const res = await fetch("https://api.escuelajs.co/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
};

const Login: React.FC = () => {
  console.log("FIND_ME_Login");
  const onClick = async (role: TRole) => {
    const data =
      role === "customer"
        ? {
            email: "john@mail.com",
            password: "changeme",
          }
        : {
            email: "admin@mail.com",
            password: "admin123",
          };
    const { access_token } = await auth(data);
    if (access_token) {
      document.cookie = `access_token=${access_token}; SameSite=Strict; Secure`;
      window.location.href = "/";
    } else {
      // generic error handler
      console.log("access restricted");
    }
  };
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1>Login Page</h1>
      <button onClick={() => onClick("customer")}>User login</button>
      <p>or</p>
      <button onClick={() => onClick("admin")}>Admin login</button>
    </div>
  );
};

export default Login;
