import React, { useContext } from "react";
import "./Header.css";
import OlxLogo from "../../assets/OlxLogo";
import Search from "../../assets/Search";
import Arrow from "../../assets/Arrow";
import SellButton from "../../assets/SellButton";
import SellButtonPlus from "../../assets/SellButtonPlus";
import { AuthContext, FirebaseContext } from "../../context/FirebaseContext";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

function Header() {
  const { user } = useContext(AuthContext);
  const firebaseContext = useContext(FirebaseContext);
  const navigate = useNavigate();

  const handelSighOut = async () => {
    if (firebaseContext) {
      try {
        await signOut(firebaseContext.auth);
        navigate("/login");
      } catch (error) {
        console.log("sigh out error:", error);
      }
    }
  };

  return (
    <div className="headerParentDiv">
      <div className="headerChildDiv">
        <div className="brandName">
          <Link to={"/"}>
          <OlxLogo />
          </Link>
        </div>
        <div className="placeSearch">
          <Search></Search>
          <input type="text" />
          <Arrow></Arrow>
        </div>
        <div className="productSearch">
          <div className="input">
            <input
              type="text"
              placeholder="Find car,mobile phone and more..."
            />
          </div>
          <div className="searchAction">
            <Search color="#ffffff"></Search>
          </div>
        </div>
        &nbsp;
        <div className="language">
          <span> ENGLISH </span>
          <Arrow></Arrow>
        </div>
        &nbsp;
        <div className="loginPage">
          <span>{user ? user.displayName : "Login"}</span>
          <hr />
        </div>
        &nbsp;&nbsp;{user && <span onClick={handelSighOut}>Logout</span>}
        <div className="sellMenu">
          <SellButton></SellButton>
          <div className="sellMenuContent">
            <SellButtonPlus></SellButtonPlus>
            <Link to="/create">
              <span>SELL</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
