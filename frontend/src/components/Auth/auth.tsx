import { useState } from "react"
import { LoginForm } from "./loginForm"
import { RegisterForm } from "./registerForm"

export default function AuthToggle() {
    const [mode, setMode] = useState<"login" | "register">("login")

    return (
        <div className="auth-container">
            <div className="auth-toggle-container" data-active={mode}>
                <button 
                    className={`auth-toggle-${mode === "login" ? "active" : "inactive"}`}
                    onClick={() => setMode("login")}
                >
                    Login
                </button>

                <button 
                    className={`auth-toggle-${mode === "register" ? "active" : "inactive"}`}
                    onClick={() => setMode("register")}
                >
                    Register
                </button>
            </div>

            <div key={mode} className="auth-form-wrapper">
                {mode === "login" ? <LoginForm /> : <RegisterForm />}
            </div>
        </div>
    )
}