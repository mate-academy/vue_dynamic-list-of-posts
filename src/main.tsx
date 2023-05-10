import ReactDOM from "react-dom/client";

import { RouterProvider,  } from "react-router-dom";

import { router } from "./App";

import "bulma/css/bulma.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
