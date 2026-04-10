import React from "react";
import "./Login.css";
import user_icon from "../assets/person.png"; // nouvelle icône utilisateur
import password_icon from "../assets/password.png";

function Login() {
  return (
    <div className="login-container">
      <div className="login-header">
        <h2>Login</h2>
        <div className="underline"></div>
      </div>

      <div className="login-inputs">
        {/* Champ Nom d'utilisateur */}
        <div className="input">
          <img src={user_icon} alt="user" />
          <input type="text" placeholder="Nom d'utilisateur" />
        </div>

        {/* Champ Mot de passe */}
        <div className="input">
          <img src={password_icon} alt="password" />
          <input type="password" placeholder="Mot de passe" />
        </div>
      </div>

      
      <div className="submit-container">
        <button className="submit-btn">SE CONNECTER</button>
      </div>
    </div>
  );
}

export default Login;