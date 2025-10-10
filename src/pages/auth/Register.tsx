"use client";
import { useState } from 'react';
import { userApi } from '@/lib/api';
import { Button, Input, Divider } from '@/components/ui';
import { showSuccess, showError } from '@/utils/toast';
import { Eye, EyeOff } from 'lucide-react';
import Colors from '@/constants/color';
import TextStyles from '@/constants/textStyle';
import type { RegisterForm } from '@/types';

export default function Register() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmitSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const registerData: RegisterForm = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            confirmPassword: formData.get("confirmPassword") as string,
            userName: formData.get("userName") as string,
        };
        if (registerData.password !== registerData.confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        try {
            const response = await userApi.register({
                userName: registerData.userName,
                email: registerData.email,
                password: registerData.password,
                confirmPassword: registerData.confirmPassword
            });

            showSuccess("Account created successfully");
            setTimeout(() => {
                window.location.href = '/feed';
            }, 1500);
        } catch (err: any) {
            const errorMessage = err?.response?.data?.message || err?.message || "Registration failed. This email may already be in use.";
            setError(errorMessage);
            showError("Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        showError("Google sign-up not implemented yet");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5 font-sans">
            <div className="flex max-w-[1000px] w-full gap-10 items-center">
                <div className="flex-1 text-left pr-10">
                    <div className="text-6xl font-bold text-blue-600 mb-2.5">
                        Social Web
                    </div>
                    <h2 className="text-3xl font-medium text-gray-900 mb-5 leading-tight">
                        Create a new account
                    </h2>

                </div>

                <div className="flex-[0_0_400px]">
                    <div className="bg-white rounded-lg shadow-lg p-5 mb-7">
                        <div className="text-center mb-5">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                Create a new account
                            </h3>
                            <p className="text-base text-gray-600">
                                Fill the form
                            </p>
                        </div>

                        <form onSubmit={handleSubmitSignup} className="flex flex-col gap-4">
                            {/* User Name Input */}
                            <div>
                                <Input
                                    type="text"
                                    name="userName"
                                    placeholder="User name"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            {/* Email Input */}
                            <div>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email address or phone number"
                                    disabled={loading}
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    disabled={loading}
                                    required
                                    className="pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-blue-600 z-10 p-1 rounded transition-all hover:bg-gray-100"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Confirm Password Input */}
                            <div className="relative">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm password"
                                    disabled={loading}
                                    required
                                    className="pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-blue-600 z-10 p-1 rounded transition-all hover:bg-gray-100"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-600 text-white px-4 py-3 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Sign Up Button */}
                            <Button
                                type="submit"
                                variant="success"
                                size="xl"
                                fullWidth
                                loading={loading}
                            >
                                Sign Up
                            </Button>

                            {/* Divider */}
                            <Divider text="or" />

                            {/* Google Sign Up Button */}
                            <Button
                                type="button"
                                variant="outline"
                                size="xl"
                                fullWidth
                                onClick={handleGoogleSignUp}
                                disabled={true}
                                className="font-semibold text-base opacity-50"
                            >
                                Google Sign-up (Coming Soon)
                            </Button>
                        </form>
                    </div>

                    {/* Sign In Section */}
                    <div className="text-center p-5 border-t border-gray-200">
                        <p className="text-base text-gray-900 mb-4">
                            Already have an account?{" "}
                            <a
                                href="/auth/login"
                                className="text-blue-600 text-[17px] font-semibold hover:text-blue-700 transition-colors"
                            >
                                Sign in to Social Web
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
