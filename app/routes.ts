// routes.ts
import { type RouteConfig, index, prefix, route, layout } from "@react-router/dev/routes";

export default [
  // "/" -> redirige a "/en/auth/login"
  index("routes/_index.tsx", { id: "root-index" }),

  // Ramas por locale: "/:locale/*"
  ...prefix(":locale", [
    layout("routes/$locale.tsx", { id: "locale-root" }, [
      index("routes/$locale/index.tsx"), // "/:locale"

      // /:locale/dashboard/*
      /*...prefix("dashboard", [
        route("", "routes/$locale/dashboard/index.tsx"), // "/:locale/dashboard"
      ]),
*/
      layout("routes/$locale/require-auth.tsx", [
        ...prefix("dashboard", [route("", "routes/$locale/dashboard/index.tsx")]),

        // En el futuro:
        // ...prefix("tables", [route("", "routes/$locale/tables/index.tsx")]),
        // ...prefix("sectors", [route("", "routes/$locale/sectors/index.tsx")]),
      ]),

      // /:locale/auth/*
      ...prefix("auth", [
        layout("routes/$locale/auth/layout.tsx", [
          route("login", "routes/$locale/auth/login.tsx"),
          route("register", "routes/$locale/auth/register.tsx"),
          route("forgot-password", "routes/$locale/auth/forgot.tsx"),
          route("reset-password", "routes/$locale/auth/reset-password.tsx"),
        ]),
      ]),
      route("*", "routes/$locale/not-found.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
