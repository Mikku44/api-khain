import { useState } from 'react';
import type { Route } from './+types/home';
import { loginWithGoogle, useAuthListener } from '~/libs/firebase/auth';
import { toast } from 'sonner';
import Loading from '~/components/Loading';
import { userService, type IUser } from '~/services/userService';



export function meta({ }: Route.MetaArgs) {
    return [
        { title: "login - API Khain.app" },
        { name: "description", content: "API KHAIN APP" },
    ];
}



export default function AdminLogin() {
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        console.log("User login")
        e.preventDefault();
        setIsLoading(true);

        const result = await loginWithGoogle(); // no parameters for Google popup

        if (!result) {
            // login failed
            toast.error("Login failed. Please try again.");
        } else {
            const { user, accessToken } = result;

            const userData: IUser = {
                user_id: user.uid,
                email: user.email ?? "",
                emailVerified: user.emailVerified,
                name: user.displayName ?? "",
                image: user.photoURL ?? "",
              
            };

            // Save or update user in Firestore
            const savedUser = await userService.createOrUpdateUser(userData);

            // Optional: do something with user / token, e.g. save to state
            // console.log("Logged in user:", user);
            // console.log("Access token:", accessToken);

            toast.success("Login successful!");
        }

        setIsLoading(false);
    };


    useAuthListener();


    return (
        <div className="flex h-screen w-full ">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <img
                    src="https://images.unsplash.com/photo-1612873003118-f0160ec93f4c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
                    alt="Classic Car"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-10 left-10 text-white">
                    <h2 className="text-4xl font-bold tracking-wider">API KHAIN.APP</h2>
                    <p className="text-sm tracking-widest mt-2">API PORTAL</p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-500">Sign in to access the API from Khain.app</p>
                    </div>

                    <div className="space-y-6">
                        {/* <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                placeholder="example@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div> */}

                        {/* <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-black"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
             <a href="#" className="text-sm text-gray-900 hover:underline">
                Forgot password?
              </a> 
            </div> */}

                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            type='button'
                            className="w-full bg-black text-white py-3 font-medium
              justify-center items-center
              hover:bg-gray-800 transition duration-200"
                        >
                            {isLoading ? <Loading /> : <div className="flex items-center gap-2">
                                <img
                                    className='size-[24px]'
                                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/36px-Google_%22G%22_logo.svg.png?20230822192911"
                                    alt="google icon" />
                                Sign In with Google</div>}
                        </button>

                    </div>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Protected by enterprise security
                    </div>
                </div>
            </div>
        </div>
    );
}