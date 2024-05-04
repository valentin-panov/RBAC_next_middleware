import { TProfileResponse } from "../types";

export const profileService = async (token: string) => {
  const profile: TProfileResponse = await fetch(
    "https://api.escuelajs.co/api/v1/auth/profile",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  ).then((response) => response.json());

  return profile;
};
