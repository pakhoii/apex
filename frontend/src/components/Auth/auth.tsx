import { useState, useEffect } from "react"
import { LoginForm } from "./loginForm"
import { RegisterForm } from "./registerForm"

export default function AuthToggle() {
    const [mode , setMode] = useState<"login" | "register">("login")
    const [setStyleLogin, setSetStyleLogin] = useState<"active" | "link">("active")
    const [setStyleRegister, setSetStyleRegister] = useState<"active" | "link">("link")

    useEffect(() => {
        if (mode === "login") {
            setSetStyleLogin("active")
            setSetStyleRegister("link")
        } else {
            setSetStyleLogin("link")
            setSetStyleRegister("active")
        }
    }, [mode])

    return (
        <div className="auth-container">
            <div className="auth-toggle-container">

                    <button className={`auth-toggle-${setStyleLogin === "link" ? "link" : "active"}`}
                        onClick={() => {
                            setMode("login")                       
                     }}>
                        Login
                    </button>

                    <button className={`auth-toggle-${setStyleRegister === "link" ? "link" : "active"}`}
                        onClick={() => {
                            setMode("register")                       
                     }}>
                        Register
                    </button>
            </div>

            {mode === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
    )
}