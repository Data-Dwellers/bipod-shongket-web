import Link from "next/link"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Register() {
    return (
        <>
            <h1 className="text-center p-3 text-3xl text-red-600">Create An Account</h1>
            <div className="flex justify-around ">
                <div className="flex flex-col w-1/3 ">
                    <Label className="py-3 text-2xl">Name</Label>
                    <Input type="text" placeholder="Name" required></Input>
                    <Label className="py-3 text-2xl" >Email</Label>
                    <Input type="email" placeholder="Email" required></Input>
                    <Label className="py-3 text-2xl">Password</Label>
                    <Input type="password" placeholder="Password" required></Input>
                    <Label className="py-3 text-2xl">Age</Label>
                    <Input type="number" placeholder="Age" required></Input>
                    <Label className="py-3 text-2xl" required>Phone Number</Label>
                    <Input type="text" placeholder="Phone Number" required></Input>
                </div>
                <div className="flex flex-col w-1/3" >
                    <Label className="py-3 text-2xl">Country</Label>
                    <Input type="text" placeholder="Country" defaultValue="Bangladesh" readOnly></Input>
                    <Label className="py-3 text-2xl">City</Label>
                    <Input type="text" placeholder="City" required></Input>
                    <Label className="py-3 text-2xl">Street</Label>
                    <Input type="text" placeholder="Street" required></Input>
                    <Label className="py-3 text-2xl" required>Zip Code</Label>
                    <Input type="number" placeholder="Zip Code"></Input>
                    <div className="px-5 py-14 flex justify-center items-center">
                        <Button className="text-2xl p-6 bg-red-600 text-white hover:bg-red-900">
                            {" "}
                            Create Account
                        </Button>
                    </div>
                </div>

            </div>
        </>
        
    );
}
