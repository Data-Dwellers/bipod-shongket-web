"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/providers/AuthProvider";
import Link from "next/link";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function LogIn() {
    // Setup firebase auth functions
    const authContext = useContext(AuthContext);
    const { control, handleSubmit } = useForm();
    const [error, setError] = useState();
    // const googleLoginHandler = async () => {
    //     authContext
    //         .googleSignIn()
    //         .then(async (result) => {
    //             console.log(result.user);
    //         })
    //         .catch((error) => {
    //             // setError(error.message);
    //             console.error(error);
    //         });
    // };

    const submitHandler = async (data) => {
        console.log(`Trying to log in ${data}`);
        authContext
            .signIn(data.email, data.password)
            .then(async (result) => {
                console.log(result.user);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div className=" flex flex-col items-center w-full h-full ">
            <h1 className="text-5xl p-5 text-red-600">
                Log In with your account
            </h1>
            <div className="grid w-full gap-6">
                <form
                    className="space-y-4"
                    onSubmit={handleSubmit(submitHandler)}
                >
                    <div>
                        <Label>Email</Label>
                        <Controller
                            control={control}
                            name="email"
                            defaultValue=""
                            rules={{
                                required: "Email is required",
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="email"
                                    placeholder="name@example.com"
                                    type="email"
                                    autoComplete="email"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Label>Password</Label>
                        <Controller
                            control={control}
                            name="password"
                            defaultValue=""
                            rules={{
                                required: "Password is mandatory",
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="password"
                                    type="password"
                                    placeholder="password"
                                />
                            )}
                        />
                    </div>
                    {error && <span className="text-destructive">{error}</span>}
                    <Button type="submit" className="w-full">
                        Log In
                    </Button>
                </form>
                <p className="px-8 text-center text-sm text-muted-foreground">
                    {"Don't have an account ? "}
                    <span
                        className="cursor-pointer font-semibold underline underline-offset-4 hover:text-primary"
                        onClick={() => router.push("/register")}
                    >
                        register
                    </span>
                    .
                </p>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    {/* <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div> */}
                </div>
                {/* <Button
                    variant="outline"
                    type="button"
                    onClick={googleLoginHandler}
                    disabled
                >
                    <Icons.google className="mr-2 h-4 w-4" />
                    Google
                </Button> */}
            </div>
        </div>
    );
}
