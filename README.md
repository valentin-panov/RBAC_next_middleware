# Role-Based Access Control in React/Next application

## Part 3: Protect the entire application: middleware

As we mentioned before, applications developed using React often encounter security vulnerabilities,
particularly concerning the limitation of unauthorized access. We have examined the reasons behind these issues
here: https://github.com/valentin-panov/RBAC_next_standart and
proposed a solution to protect standalone routes here: https://github.com/valentin-panov/RBAC_next_gSSP.

Today, I would like to discuss a scenario where protection is needed for the majority of pages in the application, with
rare exceptions. In such cases, it makes sense to apply logic that checks all requests to our application and only
allows those that adhere to our rules.

Starting from version 12.2.0, Next.js offers us the stable functionality of the middleware mechanism.
You can find the actual documentation here: https://nextjs.org/docs/app/building-your-application/routing/middleware

In a nutshell, this mechanism allows us to intercept requests to our application, perform necessary checks, and
manipulate responses accordingly.

We won't delve into the basic settings; let's proceed directly to the essence.

To determine access to various routes, we suggest defining an array that contains information about paths and the
allowed roles for each path.

```
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
```

We will also need a function for validating the received token and determining the profile/roles available to this
token.

And then we need to compare the roles of the requested route with the values obtained for the token attached to the
request. If there is a match, we can allow the request to proceed; if there is no match, we need to redirect such a
request to a secure route.

```
export default async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const profile: TProfile | null = await getProfile(request);
  const path = request.nextUrl.pathname.split("/");
  const { role } = profile;
  const currentPath = routes.find((route) => route.path === path[1]);
    const allowed = currentPath?.allowedRoles.includes(role);
    if (allowed) {
      return response;
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }  
```

The demo version of the application protected by middleware is available at this
link: https://rbac-next-middleware.vercel.app. Note that the browser doesn't "winks" with the protected page and does
not disclose secured chunks of JavaScript code.

The advantage of this approach lies in its ability to fortify the entire application and direct unauthenticated users to
selected routes only.

If you have any questions on the table or require explanations, feel free to comment or message directly.

### Used fake API:

https://fakeapi.platzi.com/en/rest/users/