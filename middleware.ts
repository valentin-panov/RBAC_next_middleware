import { NextRequest, NextResponse } from "next/server";
import { profileService } from "./services";
import { TProfileResponse } from "./types";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
    // "/dashboard",
    // "/api/",
  ],
};

const redirectToHome = () => {
  return NextResponse.redirect("/");
};
const redirectToLogin = () => {
  return NextResponse.redirect("/login");
};

const verifyTokenInRequest = async (req: NextRequest) => {
  const token =
    req.cookies.get("access_token") ||
    req.headers.get("Authorization")?.slice(7);
  console.log(token);
  if (token) {
    return await verifyToken(token);
  } else {
    redirectToLogin();
  }
};

/**
 * Verifies the user's JWT token and returns its payload if it's valid.
 */
const verifyToken = async (token: string) => {
  const profile = await profileService(token);
  // case of invalid token
  if (profile.statusCode == 401) {
    redirectToLogin();
  } else {
    return profile;
  }
};

export default async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  console.log("[middleware in] => pathname [", request.nextUrl.pathname, "]");

  //get the actual request path
  const path = request.nextUrl.pathname.split("/");

  if (path[1] === "") {
    console.log("homepage => [middleware exit]");
    return response;
  }

  const profile: TProfileResponse = await verifyTokenInRequest(request);

  // redirect to home tried to re-authenticate logged-in user, or pass through
  if (request.nextUrl.pathname.startsWith("/login")) {
    if (profile) {
      console.log(
        "auth page within authenticated session, redirect to homepage => [middleware exit]",
      );
      return redirectToHome();
    } else {
      return response;
    }
  }

  let { role } = profile;

  const currentPath = routes.find((route) => route.path === path[1]);
  const allowed = currentPath?.allowedRoles.includes(role);
  if (allowed) {
    console.log("[", currentPath?.path, "] allowed => [middleware exit]");
    return response;
  } else {
    console.log("[", currentPath?.path, "] isn't allowed => [middleware exit]");
    return redirectToHome();
  }
}
