import React, { useEffect } from "react";
import Products from "../components/products";
import { TProduct, TProfile } from "types";
import { getCookie, logout } from "utils";
import { productService, profileService } from "services";
import Users from "components/users";

// This is the client side logic
const Index: React.FC = () => {
  console.log("FIND_ME_Index");
  const [profile, setProfile] = React.useState<TProfile>({
    id: "string",
    email: "string",
    password: "string",
    name: "string",
    role: "customer",
    avatar: "string",
  });
  const [products, setProducts] = React.useState<TProduct[]>([
    {
      id: "string",
      title: "string",
      price: "string",
      description: "string",
      category: {
        id: "string",
        name: "string",
        image: "string",
      },
      images: ["string"],
    },
  ]);

  useEffect(() => {
    const token = getCookie("access_token");
    if (!token) {
      window.location.href = "/login";
    } else {
      profileService(token).then((profile) => {
        // case of invalid token
        if (profile.statusCode == 401) {
          window.location.href = "/login";
        } else {
          setProfile(profile);
        }
      });
      productService().then((products) => setProducts(products));
    }
  }, []);

  const switchRole = () => {
    if (profile?.role !== "admin") {
      setProfile({ ...profile, role: "admin" });
    } else {
      setProfile({ ...profile, role: "customer" });
    }
  };

  return (
    <div>
      <h1>Protected page</h1>
      <button onClick={logout}>Logout</button>
      <p>
        <a href={"/admin"}>ADMIN SPACE &quot;/admin&quot;</a>
      </p>

      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Products products={products} />
        <div>
          <p>Name: {profile.name}</p>
          <p>Email: {profile.email}</p>
          <p>Your role: {profile.role}</p>
          <button onClick={switchRole}>Switch role</button>
          {profile.role === "admin" && <Users />}
        </div>
      </div>
    </div>
  );
};

export default Index;
