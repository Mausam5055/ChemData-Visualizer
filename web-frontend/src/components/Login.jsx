import { useState } from 'react';
import api from '../api';
import { GoogleLogin } from '@react-oauth/google';

export default function Login({ onLogin, onSwitchToSignup }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('api/api-token-auth/', { username, password });
            onLogin(response.data.token);
        } catch (err) {
            setError('Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = (credentialResponse) => {
        console.log(credentialResponse);
        alert("Google Login Success! Token: " + credentialResponse.credential);
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Side - Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
                <div className="max-w-md w-full mx-auto">
                    {/* Logo Area */}
                    <div className="flex items-center gap-2 mb-12">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">ChemViz</span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
                    <p className="text-gray-500 mb-6">Let's get you signed in securely.</p>

                    {/* Cold Start Warning */}
                    <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                         <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                         <div className="text-sm text-amber-800">
                            <strong>Note:</strong> The backend is hosted on a free instance and may take <strong>~50 seconds</strong> to wake up for the first login. Please be patient!
                         </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Username or Email</label>
                            <input 
                                type="text" 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                                placeholder="Enter Your Username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-sm font-semibold text-gray-700">Password</label>
                                <a href="#" className="text-sm text-primary-600 hover:text-primary-500 font-semibold">Forgot Your Password?</a>
                            </div>
                            <input 
                                type="password" 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                                placeholder="Your Password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing In...
                                </>
                            ) : (
                                "Log in with Email"
                            )}
                        </button>
                    </form>

{/* 
                    <div className="mt-6 flex flex-col gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="flex justify-center w-full">
                             <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => console.log('Login Failed')}
                                shape="pill"
                                width="350px"
                            />
                        </div>
                    </div>
                    */}

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Don't Have an Account?{' '}
                        <button onClick={onSwitchToSignup} className="font-bold text-primary-600 hover:text-primary-500">
                            Sign Up
                        </button>
                    </p>
                </div>
            </div>

            {/* Right Side - Visuals */}
            <div className="hidden md:flex md:w-1/2 bg-gray-50 relative overflow-hidden items-center justify-center p-12">
                
                {/* Decorative blobs */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-primary-100 blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary-100 blur-3xl opacity-50"></div>
                
                <div className="relative w-full max-w-lg">
                    <div className="mb-6">
                        <span className="text-primary-600 font-semibold tracking-wide uppercase text-xs">Analytics Dashboard</span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2">Monitor Chemical Parameters<br/>in Real-Time</h2>
                        <p className="text-gray-500 mt-2">Track flowrates, pressure, and temperature with advanced visualization.</p>
                    </div>

                    {/* Dashboard Mockup Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800">Overview</h3>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Live Data</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                             <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-gray-500 text-xs">Avg Flowrate</p>
                                <p className="text-xl font-bold text-gray-800 mt-1">120.5 <span className="text-green-500 text-sm">↑ 12%</span></p>
                             </div>
                             <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-gray-500 text-xs">Pressure (PSI)</p>
                                <p className="text-xl font-bold text-gray-800 mt-1">15.2 <span className="text-red-500 text-sm">↓ 2%</span></p>
                             </div>
                        </div>

                        {/* Fake Chart Area */}
                        <div className="h-40 bg-gray-50 rounded-xl relative overflow-hidden flex items-end justify-between px-2 pb-0 opacity-80">
                            <div className="w-1/6 bg-primary-200 h-[40%] rounded-t-sm mx-1"></div>
                            <div className="w-1/6 bg-primary-300 h-[70%] rounded-t-sm mx-1"></div>
                            <div className="w-1/6 bg-primary-500 h-[50%] rounded-t-sm mx-1"></div>
                            <div className="w-1/6 bg-primary-600 h-[85%] rounded-t-sm mx-1"></div>
                            <div className="w-1/6 bg-primary-400 h-[60%] rounded-t-sm mx-1"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
