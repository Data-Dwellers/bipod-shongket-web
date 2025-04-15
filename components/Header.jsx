import { Button } from "./ui/button";

export const Header = () => {
    return (
        <div className="flex justify-between px-5 py-5">
            <h1 className="text-center flex items-center justify-center font-bold text-2xl text-red-600">
                Bipod Shongket
            </h1>
            <div className="space-x-2">
                <Button>Log In</Button>
                <Button>Register</Button>
                <Button>About</Button>
            </div>
        </div>
    );
};
