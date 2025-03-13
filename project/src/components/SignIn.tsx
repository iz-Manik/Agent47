import { useState } from 'react';
import { UserCircle, LogIn, LogOut } from 'lucide-react';

interface SignInProps {
  className?: string;
}

export function SignIn({ className = '' }: SignInProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock sign in
    setIsSignedIn(true);
    setIsOpen(false);
    setEmail('');
    setPassword('');
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
  };

  return (
    <div className={`relative ${className}`}>
      {isSignedIn ? (
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <UserCircle className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
          <LogOut className="w-4 h-4" />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <UserCircle className="w-5 h-5" />
          <span className="font-medium">Sign In</span>
          <LogIn className="w-4 h-4" />
        </button>
      )}

      {isOpen && !isSignedIn && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      )}
    </div>
  );
}