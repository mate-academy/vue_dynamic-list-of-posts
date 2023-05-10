import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";

import { createUser, getUserByEmail } from "../../api";

export const Login = () => {
  const navigate = useNavigate();
  //some change
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const [needToRegister, setNeedToRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const saveUser = (user: User.Data) => {
    localStorage.setItem("user", JSON.stringify(user));
  };

  const register = async () => {
    try {
      const user = await createUser({ name, email });

      user && saveUser(user);
    } catch (err) {
      setErrorMessage("Can't create a user");
    }
  };

  const checkEmail = async () => {
    try {
      const existingUser = await getUserByEmail(email);

      existingUser ? saveUser(existingUser) : setNeedToRegister(true);
    } catch (err) {
      setErrorMessage("Can't create a user");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    const callback = needToRegister ? register : checkEmail;

    await callback();

    setLoading(false);
    navigate("/");
  };

  return (
    <section className="container is-flex is-justify-content-center	">
      <form onSubmit={handleSubmit} className="box mt-5">
        <h1 className="title is-3">
          {needToRegister ? "You need to register" : "Get your userId"}
        </h1>

        <div className="field">
          <label className="label" htmlFor="user-email">
            Email
          </label>

          <div
            className={classNames("control has-icons-left", {
              "is-loading": loading,
            })}
          >
            <input
              type="email"
              id="user-email"
              name="email"
              className={classNames("input", {
                "is-danger": !needToRegister && errorMessage,
              })}
              placeholder="Enter your email"
              disabled={loading || needToRegister}
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
            />

            <span className="icon is-small is-left">
              <i className="fas fa-envelope" />
            </span>
          </div>

          {!needToRegister && errorMessage && (
            <p className="help is-danger">{errorMessage}</p>
          )}
        </div>

        {needToRegister && (
          <div className="field">
            <label className="label" htmlFor="user-name">
              Your Name
            </label>

            <div
              className={classNames("control has-icons-left", {
                "is-loading": loading,
              })}
            >
              <input
                type="text"
                id="user-name"
                name="name"
                className={classNames("input", {
                  "is-danger": needToRegister && errorMessage,
                })}
                placeholder="Enter your name"
                required
                minLength={4}
                disabled={loading}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <span className="icon is-small is-left">
                <i className="fas fa-user" />
              </span>
            </div>

            {needToRegister && errorMessage && (
              <p className="help is-danger">{errorMessage}</p>
            )}
          </div>
        )}

        <div className="field">
          <button
            type="submit"
            className={classNames("button is-primary", {
              "is-loading": loading,
            })}
          >
            {needToRegister ? "Register" : "Login"}
          </button>
        </div>
      </form>
    </section>
  );
};
