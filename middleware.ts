import { NextRequest, NextResponse } from "next/server";
import { profileService } from "./services";
import { TProfile } from "./types";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

const routes = [
  {
    path: "",
    allowedRoles: ["customer", "admin"],
  },
  {
    path: "admin",
    allowedRoles: ["admin"],
  },
  {
    path: "login",
    allowedRoles: [""],
  },
];

const getProfile = async (req: NextRequest) => {
  const token =
    req.cookies.get("access_token") ||
    req.headers.get("Authorization")?.slice(7);
  if (token) {
    const profile = await profileService(token);
    if (profile.statusCode != 401) {
      return profile;
    }
  }
  return null;
};

export default async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  console.log("[middleware in] => pathname [", request.nextUrl.pathname, "]");

  const profile: TProfile | null = await getProfile(request);

  const path = request.nextUrl.pathname.split("/");

  if (path[1] === "") {
    if (profile === null) {
      console.log(
        "unauthorised request to the homepage => [redirect to login]",
      );
      return NextResponse.redirect(new URL("/login", request.url));
    } else {
      console.log("authorised request to the homepage => [middleware exit]");
      return response;
    }
  } else if (path[1] === "login") {
    if (profile) {
      console.log(
        "request to the Login Page within the authenticated session => [redirect to the homepage]",
      );
      return NextResponse.redirect(new URL("/", request.url));
    } else {
      return response;
    }
  } else {
    // role-based protected routes
    const role = profile ? profile.role : "";
    const currentPath = routes.find((route) => route.path === path[1]);
    const allowed = currentPath?.allowedRoles.includes(role);
    if (allowed) {
      console.log(
        "authorised request to [",
        currentPath?.path,
        "] => [middleware exit]",
      );
      return response;
    } else {
      console.log(
        "unauthorised request to [",
        currentPath?.path,
        "] => [redirect to the homepage]",
      );
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}
