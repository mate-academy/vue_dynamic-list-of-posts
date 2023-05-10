import { createBrowserRouter, redirect } from "react-router-dom";

import { Login } from "./routes/login";
import { Dashboard } from "./routes/dashboard";
import { getUserFromLS } from "./utils/getUser";

export const router = createBrowserRouter(
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
  { basename: "/react-vite-gh-pages/" }
);
