import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LogIn() {
    return (
        <div className=" flex flex-col items-center w-full h-full ">
            <h1 className="text-5xl p-5 text-red-600">Create an Account</h1>
            <div className="w-1/3 ">
                <Label className="py-3 text-2xl">Email</Label>
                <Input type="email" placeholder="Email"></Input>
            </div>
            <div className="w-1/3 ">
                <Label className="py-3 text-2xl">Name</Label>
                <Input type="text" placeholder="Name"></Input>
            </div>
            <div className="w-1/3 ">
                <Label className="py-3 text-2xl">Password</Label>
                <Input type="password" placeholder="password"></Input>
            </div>
            <div className="w-1/3 ">
                <Label className="py-3 text-2xl">Phone Number</Label>
                <Input type="phone" placeholder="Phone Number"></Input>
            </div>
            <div className="p-5">
                <Button className=" bg-red-600 text-white hover:bg-red-900">
                    {" "}
                    Create Account
                </Button>
            </div>
        </div>
    );
}
