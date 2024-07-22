import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../olx-logo.png";
import "./Signup.css";
import { FirebaseContext } from "../../context/FirebaseContext";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const [username, setUsername] = useState<string | null>("");
  const [email, setEmail] = useState<string | null>("");
  const [phone, setPhone] = useState<string | null>("");
  const [password, setPassword] = useState<string | null>("");
  const [errors, setErrors] = useState<Errors>({});
  const firebaseContext = useContext(FirebaseContext);
  const navigate = useNavigate();

  interface Errors {
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: Errors = {};

    if (!username || !/^[a-zA-Z\s]+$/.test(username)) {
      newErrors.username = "Invalid username.";
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email.";
    }

    if (!phone || !/^\d+$/.test(phone)) {
      newErrors.phone = "Phone number is required.";
    }

    if (!password || password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (firebaseContext) {
      const { auth, db } = firebaseContext;
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email!,
          password!
        );
        if (userCredential.user) {
          await updateProfile(userCredential.user, { displayName: username });

          // Save user data to Firestore
          await setDoc(doc(db, "users", userCredential.user.uid), {
            uid: userCredential.user.uid,
            username: username,
            phone: phone,
            email: email,
          });

          navigate("/login");
        }
      } catch (error) {
        console.error("Error signing up:", error);
      }
    }
  };

  return (
    <div>
      <div className="signupParentDiv">
        <img width="200px" height="200px" src={Logo}></img>
        <form onSubmit={handleSubmit}>
          <label htmlFor="fname">Username</label>
          <br />
          <input
            className={`input ${errors.username ? "error" : ""}`}
            type="text"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
            id="name"
            name="name"
            placeholder="User Name"
          />
          {errors.username && (
            <p className="error-message">{errors.username}</p>
          )}
          <br />
          <label htmlFor="fname">Email</label>
          <br />
          <input
            className={`input ${errors.email ? "error" : ""}`}
            type="email"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            name="email"
            placeholder="Email"
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
          <br />
          <label htmlFor="lname">Phone</label>
          <br />
          <input
            className={`input ${errors.phone ? "error" : ""}`}
            type="number"
            value={phone || ""}
            onChange={(e) => setPhone(e.target.value)}
            id="phone"
            name="phone"
            placeholder="Mobile Number"
          />
          <br />
          {errors.phone && <p className="error-message">{errors.phone}</p>}
          <label htmlFor="lname">Password</label>
          <br />
          <input
            className={`input ${errors.password ? "error" : ""}`}
            type="password"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
            defaultValue="Doe"
            placeholder="Password"
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
          <br />
          <br />
          <button>Signup</button>
        </form>
        <Link to={"/login"}>
          <p>Login</p>
        </Link>
      </div>
    </div>
  );
}
