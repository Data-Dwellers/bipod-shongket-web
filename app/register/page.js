"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthContext } from "@/providers/AuthProvider";
import { createUser } from "@/services/userService";
import Link from "next/link";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function LogIn() {
    // Setup firebase auth functions
    const authContext = useContext(AuthContext);
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm();
    const [authError, setAuthError] = useState();

    const submitHandler = async (data) => {
        console.log(`Trying to log in ${data}`);
        authContext
            .createUser(data.email, data.password)
            .then(async (result) => {
                console.log(result.user);
                createUser({ ...data })
                    .then(async () => {
                        console.log("User saved in DB");
                    })
                    .catch((error) => {
                        setAuthError(error);
                    });
            })
            .catch((error) => {
                setAuthError(error.message);
                setError(errors);
                console.error(error);
            });
    };

    return (
        <div className=" flex flex-col items-center w-full h-full ">
            <h1 className="text-5xl p-5 text-red-600">Register your account</h1>
            <div className="grid gap-6 min-w-96">
                <form
                    className="space-y-4"
                    onSubmit={handleSubmit(submitHandler)}
                >
                    <div>
                        <Label className="mb-2">Name</Label>
                        <Controller
                            control={control}
                            name="name"
                            defaultValue=""
                            rules={{
                                required: "Name is required",
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="name"
                                    placeholder="John Doe"
                                    type="text"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Label className="mb-2">Email</Label>
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
                        <Label className="mb-2">Password</Label>
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
                    <div>
                        <Label className="mb-2">Age</Label>
                        <Controller
                            control={control}
                            name="age"
                            defaultValue=""
                            rules={{
                                required: "Age is required",
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="age"
                                    placeholder="0"
                                    type="number"
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Label className="mb-2">Phone Number</Label>
                        <Controller
                            control={control}
                            name="phone"
                            defaultValue=""
                            rules={{
                                required: "Phone number is required",
                            }}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="phone"
                                    placeholder="01521111913"
                                    type="tel"
                                />
                            )}
                        />
                    </div>
                    {authError && (
                        <span className="text-destructive">{authError}</span>
                    )}
                    {errors &&
                        Object.entries(errors).map(([field, err]) => (
                            <p key={field} className="text-destructive">
                                {err.message}
                            </p>
                        ))}
                    <Button type="submit" className="w-full">
                        Register
                    </Button>
                </form>
                <p className="px-8 text-center text-sm text-muted-foreground">
                    {"Already have an account ? "}
                    <Link href="/log-in">
                        <span className="cursor-pointer font-semibold underline underline-offset-4 hover:text-primary">
                            log in
                        </span>
                    </Link>
                    .
                </p>
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                </div>
            </div>
        </div>
    );
}
