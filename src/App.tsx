import { createHashRouter, redirect } from "react-router-dom";

import { Login } from "./routes/login";
import { Dashboard } from "./routes/dashboard";
import { getUserFromLS } from "./utils/getUser";

export const router = createHashRouter(
  [
    {
      path: "/login",
      element: <Login />,

      loader: () => {
        if (getUserFromLS()) {
          return redirect("/");
        }

        return false;
      },
    },
    {
      path: "/",
      element: <Dashboard />,
      loader: () => {
        if (!getUserFromLS()) {
          return redirect("/login");
        }

        return true;
      },
    },
  ],
  { basename: "/vue_dynamic-list-of-posts/" }
);
