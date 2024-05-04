import { NextRequest, NextResponse } from "next/server";
import { profileService } from "./services";
import { TProfile } from "./types";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    // "/dashboard",
    // "/api/",
  ],
};

const routes = [
  {
    label: "Home Page",
    path: "",
    allowedRoles: ["customer", "admin"],
  },
  {
    label: "Admin Space",
    path: "admin",
    allowedRoles: ["admin"],
  },
  {
    label: "Login Page",
    path: "login",
    allowedRoles: ["", "customer", "admin"],
  },
];

const redirectToHome = (req: NextRequest) => {
  return NextResponse.redirect(new URL("/", req.url));
};
const redirectToLogin = (req: NextRequest) => {
  return NextResponse.redirect(new URL("/login", req.url));
};

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

  //get the actual request path
  const path = request.nextUrl.pathname.split("/");

  if (path[1] === "") {
    if (profile === null) {
      console.log(
        "unauthorised request to the homepage => [redirect to login]",
      );
      return redirectToLogin(request);
    } else {
      console.log("authorised request to the homepage => [middleware exit]");
      return response;
    }
  }

  // redirect to home tried to re-authenticate logged-in user, or pass through
  if (path[1] === "login") {
    if (profile) {
      console.log(
        "request to the Login Page within authenticated session => [redirect to the homepage]",
      );
      return redirectToHome(request);
    } else {
      return response;
    }
  }

  const role = profile?.role || "";
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
    return redirectToHome(request);
  }
}
