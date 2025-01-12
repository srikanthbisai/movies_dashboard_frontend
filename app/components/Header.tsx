// app/components/Header.tsx
"use client";
import Link from "next/link";
import { useAuth } from "../providers";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
            Movie Dashboard
          </h1>
          <Link href="/movies" className="font-serif text-yellow-400 font-bold">
            <button className="p-2 bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 text-yellow-300 rounded-md">
              Browse Movies
            </button>
          </Link>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Welcome{" "}
              <span className="font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
                {user.name}
              </span>
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
