import { useState } from 'react';
import api from '../api';

export default function Signup({ onLogin, onSwitchToLogin }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }
        setLoading(true);
        try {
            const response = await api.post('auth/registration/', { username, email, password1: password, password2: confirmPassword });
            if (response.data.key) {
                onLogin(response.data.key);
            } else {
                onSwitchToLogin();
            }
        } catch (err) {
            setError(JSON.stringify(err.response?.data) || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-sans">
            {/* Left Side - Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
                <div className="max-w-md w-full mx-auto">
                    {/* Logo Area */}
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">ChemViz</span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-500 mb-6">Join us to visualize your data efficiently.</p>

                    {/* Cold Start Warning */}
                    <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg flex gap-3">
                         <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                         <div className="text-sm text-amber-800">
                            <strong>Note:</strong> The backend is hosted on a free instance and may take <strong>~50 seconds</strong> to wake up after sign up.
                         </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                            <input 
                                type="text" 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                                placeholder="Choose a username" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <input 
                                type="email" 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                                placeholder="you@example.com" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <input 
                                type="password" 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                                placeholder="Create a password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                            <input 
                                type="password" 
                                required 
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-600 focus:border-transparent outline-none transition-all"
                                placeholder="Confirm your password" 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                            />
                        </div>

                        {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <button onClick={onSwitchToLogin} className="font-bold text-primary-600 hover:text-primary-500">
                            Sign In
                        </button>
                    </p>
                </div>
            </div>

            {/* Right Side - Visuals (Identical to Login) */}
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
