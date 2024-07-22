import React, { useState, useContext } from "react";
import { FirebaseContext } from "../../context/FirebaseContext";
import Logo from "../../olx-logo.png";
import "./Login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Errors {
  email?: string;
  password?: string;
}

function Login() {
  const [email, setEmail] = useState<string | null>("");
  const [password, setPassword] = useState<string | null>("");
  const [errors, setErrors] = useState<Errors>({});
  const firebaseContext = useContext(FirebaseContext);
  const navigate = useNavigate();

  const handelLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: Errors = {};

    if (!email) newErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email.";

    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (firebaseContext) {
      const { auth } = firebaseContext;
      try {
        await signInWithEmailAndPassword(auth, email!, password!);
        navigate("/");
        toast.success("Login successful!");
      } catch (error) {
        console.error("error loggin in:", error);
        toast.error("Login failed. Please check your email and password.");
      }
    }
  };

  return (
    <div>
      <div className="loginParentDiv">
        <img width="200px" height="200px" src={Logo}></img>
        <form onSubmit={handelLogin}>
          <label htmlFor="fname">Email</label>
          <br />
          <input
            className={`input ${errors.email ? "error" : ""}`}
            type="email"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            id="fname"
            name="email"
            placeholder="Email"
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
          <br />
          <label htmlFor="lname">Password</label>
          <br />
          <input
            className={`input ${errors.password ? "error" : ""}`}
            type="password"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
            id="lname"
            name="password"
            placeholder="Password"
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
          <br />
          <br />
          <button>Login</button>
        </form>
        <Link to={"/signup"}>
          <p>Signup</p>
        </Link>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
