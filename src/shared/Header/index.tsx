import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { getUserFromLS } from "utils/getUser";

export const Header: FC = () => {
  const user = getUserFromLS();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");

    navigate("/login");
  }, [navigate]);

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-item">
        <h2 className="is-size-4">Vue List Of Posts</h2>
      </div>
      <div className="navbar-end">
        <div className="navbar-item">
          <div className="buttons">
            {user && (
              <div className="mr-5 mb-2">
                <p>User: {user.name}</p>
              </div>
            )}
            <a className="button is-light" onClick={handleLogout}>
              Logout
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
