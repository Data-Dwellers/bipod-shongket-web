import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

export const Header = () => {
    return (
        <div className="flex justify-between px-5 py-5">
            <Link to="/">
                <h1 className="text-center flex items-center justify-center font-bold text-2xl text-red-600">
                    Bipod Shongket
                </h1>
            </Link>
            
            <div className="space-x-2">
                <Link to="/log-in"><Button >Log In</Button></Link>
                <Link to="/register"><Button >Register</Button></Link>
                <Link to="/sbout"><Button >About</Button></Link>
                <ThemeToggle></ThemeToggle>
            </div>
        </div>
    );
};
