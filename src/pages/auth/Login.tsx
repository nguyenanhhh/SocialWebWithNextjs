"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useAppDispatch } from '@/hooks';
import { setUser } from '@/redux/slices/authSlice';
import { Button, Input, Divider } from '@/components/ui';
import { showSuccess, showError } from '@/utils/toast';
import { Eye, EyeOff } from 'lucide-react';
import Colors from '@/constants/color';
import TextStyles from '@/constants/textStyle';

export default function Login() {
    const dispatch = useAppDispatch();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const data = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        };

        try {
            const result = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            const userData = {
                id: '1',
                email: data.email,
                userName: data.email.split('@')[0], 
                avatar: undefined
            };
            
            dispatch(setUser(userData));
            showSuccess("Login successful");
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        } catch (err: any) {
            const errorMessage = err?.message || "Invalid email or password";
            setError(errorMessage);
            showError("Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signIn('google', { callbackUrl: '/dashboard' });
        } catch (error) {
            showError("Google sign-in failed");
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: Colors.bgSecondary,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
            <div style={{
                display: "flex",
                maxWidth: "1000px",
                width: "100%",
                gap: "40px",
                alignItems: "center"
            }}>
                {/* Left Side - Social Web Logo */}
                <div style={{
                    flex: "1",
                    textAlign: "left",
                    paddingRight: "40px"
                }}>
                    <div style={{
                        fontSize: "4rem",
                        fontWeight: "bold",
                        color: Colors.primary,
                        marginBottom: "10px"
                    }}>
                        Social Web
                    </div>
                    <h2 style={{
                        ...TextStyles.displayMedium,
                        color: Colors.textPrimary,
                        marginBottom: "20px",
                        lineHeight: "1.2"
                    }}>
                        Welcome to Social Web
                    </h2>
                </div>

                {/* Right Side - Login Form */}
                <div style={{
                    flex: "0 0 400px"
                }}>
                    <div style={{
                        backgroundColor: Colors.bgPrimary,
                        borderRadius: "8px",
                        boxShadow: `0 2px 4px ${Colors.shadowLight}, 0 8px 16px ${Colors.shadowMedium}`,
                        padding: "20px"
                    }}>
                        <div style={{
                            textAlign: "center",
                            marginBottom: "20px"
                        }}>
                            <h3 style={{
                                ...TextStyles.headingLarge,
                                color: Colors.textPrimary,
                                marginBottom: "8px"
                            }}>
                                Log into your account
                            </h3>
                            <p style={{
                                ...TextStyles.bodyMedium,
                                color: Colors.textSecondary
                            }}>
                                Welcome back to Social Web.
                            </p>
                        </div>

                        <form onSubmit={handleSubmitLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                            <div style={{ position: "relative" }}>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    disabled={loading}
                                    required
                                    style={{
                                        paddingRight: "50px"
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: "16px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: Colors.primary,
                                        zIndex: 10,
                                        padding: "4px",
                                        borderRadius: "4px",
                                        transition: "all 0.2s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = Colors.bgSecondary;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div style={{
                                    backgroundColor: Colors.danger,
                                    color: Colors.textInverse,
                                    padding: "12px 16px",
                                    borderRadius: "6px",
                                    fontSize: "14px"
                                }}>
                                    {error}
                                </div>
                            )}

                            {/* Login Button */}
                            <Button
                                type="submit"
                                variant="primary"
                                size="xl"
                                fullWidth
                                loading={loading}
                            >
                                Log In
                            </Button>

                            {/* Forgot Password Link */}
                            <div style={{ textAlign: "center" }}>
                                <a
                                    href="/auth/ResetPassWord"
                                    style={{
                                        ...TextStyles.link,
                                        fontSize: "14px"
                                    }}
                                >
                                    Forgotten password?
                                </a>
                            </div>

                            {/* Divider */}
                            <Divider text="or" />

                            {/* Google Sign In Button */}
                            <Button
                                type="button"
                                variant="outline"
                                size="xl"
                                fullWidth
                                onClick={handleGoogleSignIn}
                                style={{
                                    fontWeight: "600",
                                    fontSize: "16px"
                                }}
                            >
                                Continue with Google
                            </Button>
                        </form>
                    </div>

                    {/* Sign Up Section */}
                    <div style={{
                        textAlign: "center",
                        marginTop: "28px",
                        padding: "20px",
                        borderTop: `1px solid ${Colors.borderPrimary}`
                    }}>
                        <p style={{
                            ...TextStyles.bodyMedium,
                            color: Colors.textPrimary,
                            marginBottom: "16px"
                        }}>
                            Don't have an account?{" "}
                            <a
                                href="/auth/register"
                                style={{
                                    ...TextStyles.linkHover,
                                    fontSize: "17px",
                                    fontWeight: "600"
                                }}
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
