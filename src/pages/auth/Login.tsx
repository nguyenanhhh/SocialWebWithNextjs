import { useState } from 'react';
import { useRouter } from 'next/router';
import useAuthStore from '@/store/authStore';
import { userApi } from '@/lib/api';
import { Button, Input, Divider } from '@/components/ui';
import { showSuccess, showError } from '@/utils/toast';
import { Eye, EyeOff } from 'lucide-react';
import Colors from '@/constants/color';
import TextStyles from '@/constants/textStyle';
import type { LoginForm } from '@/types';

export default function Login() {
    const login = useAuthStore((state) => state.login);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const loginData: LoginForm = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        };

        try {
            const response = await userApi.login(loginData);
            const { data: user } = response.data;

            const token = `token_${user._id}_${Date.now()}`;

            login(user, token);
            showSuccess("Login successful");

            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Invalid email or password";
            setError(errorMessage);
            showError("Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        showError("Google sign-in not implemented yet");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5 font-sans">
            <div className="flex max-w-[1000px] w-full gap-10 items-center">
                <div className="flex-1 text-left pr-10">
                    <div className="text-6xl font-bold text-blue-600 mb-2.5">
                        Social Web
                    </div>
                    <h2 className="text-3xl font-medium text-gray-900 mb-5 leading-tight">
                        Welcome to Social Web
                    </h2>
                </div>

                <div className="flex-[0_0_400px]">
                    <div className="bg-white rounded-lg shadow-lg p-5">
                        <div className="text-center mb-5">
                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                                Log into your account
                            </h3>
                            <p className="text-base text-gray-600">
                                Welcome back to Social Web.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmitLogin}
                            className="flex flex-col gap-4"
                        >
                            <div>
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email address or phone number"
                                    disabled={loading}
                                    required
                                />
                            </div>

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

                            {error && (
                                <div className="bg-red-600 text-white px-4 py-3 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                variant="default"
                                size="xl"
                                fullWidth
                                loading={loading}
                            >
                                Log In
                            </Button>

                            <div className="text-center">
                                <a
                                    href="/auth/resetPassWord"
                                    className="text-blue-600 text-sm hover:text-blue-700 transition-colors"
                                >
                                    Forgotten password?
                                </a>
                            </div>

                            <Divider text="or" />

                            <Button
                                type="button"
                                variant="outline"
                                size="xl"
                                fullWidth
                                onClick={handleGoogleSignIn}
                                disabled={true}
                                className="font-semibold text-base opacity-50"
                            >
                                Google Sign-in (Coming Soon)
                            </Button>
                        </form>
                    </div>

                    <div className="text-center mt-7 p-5 border-t border-gray-200">
                        <p className="text-base text-gray-900 mb-4">
                            Don't have an account?{" "}
                            <a
                                href="/auth/register"
                                className="text-blue-600 text-[17px] font-semibold hover:text-blue-700 transition-colors"
                            >
                                Sign up for Social Web
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
