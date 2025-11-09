import { useContext, useState } from "react";
import Button from "../components/base/Button";
import { AuthContext } from "../context/auth";
import { useLocation } from "wouter";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [confirm, setConfirm] = useState("");

    const [_, setLocation] = useLocation();

    const auth = useContext(AuthContext);

    async function register() {
        if (confirm != password) {
            setError("Passwords don't match!");
            return;
        }

        const user = await auth.register(email, password, name);
        if (!user) {
            setError("Account with this email already exists!");
            return;
        }

        setLocation("/");
    }

    return (
        <div className="main-center">
            <div className="mt-12 border rounded-md bg-white w-full md:w-120 p-6 mx-auto ">
                <h2 className="text-2xl font-bold text-center">
                    Register account
                </h2>
                <p className={"mt-2 text-center text-red-500"}>{error}</p>
                <input
                    onChange={(e) => setName(e.target.value)}
                    className="mt-6"
                    placeholder="Name"
                    type="text"
                ></input>
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-6"
                    placeholder="Email"
                    type="email"
                ></input>
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-4"
                    placeholder="Password"
                    type="password"
                ></input>
                <input
                    onChange={(e) => setConfirm(e.target.value)}
                    className="mt-2"
                    placeholder="Confirm password"
                    type="password"
                ></input>
                <Button onClick={register} className="w-full mt-4">
                    Sign up
                </Button>
            </div>
        </div>
    );
}

export default Register;
