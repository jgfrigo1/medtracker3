
import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: () => void;
  correctPassword: string;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, correctPassword }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      onLogin();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-100 to-cyan-200">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Health Tracker Diario</h2>
          <p className="mt-2 text-gray-600">Por favor, introduce la contraseña para continuar.</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
             <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className={`w-full px-4 py-3 text-gray-900 bg-gray-100 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition duration-300 ${error ? 'border-red-500 ring-2 ring-red-300' : 'border-gray-200'}`}
              placeholder="Contraseña"
            />
          </div>
            {error && <p className="text-sm text-center text-red-600">Contraseña incorrecta. Inténtalo de nuevo.</p>}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg hover:from-teal-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-transform transform hover:scale-105 duration-300"
            >
              Acceder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
