import React, { useEffect } from "react";
import { profileService } from "services";
import { getCookie } from "utils";

const Admin: React.FC = () => {
  console.log("FIND_ME_Admin");

  useEffect(() => {
    const token = getCookie("access_token");
    if (!token) {
      window.location.href = "/";
    } else {
      profileService(token).then((profile) => {
        // case of invalid token came from the frontend side
        if (profile.statusCode == 401) {
          window.location.href = "/login";
        } else if (profile.role !== "admin") {
          window.location.href = "/";
        }
      });
    }
  }, []);

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
      <h1>Admin Space</h1>
      <button onClick={() => (window.location.href = "/")}>
        Back to index
      </button>
    </div>
  );
};

export default Admin;
