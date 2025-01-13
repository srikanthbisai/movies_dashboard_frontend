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
      <div className="w-full md:w-[90%] mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full sm:w-auto">
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
              Movie Dashboard
            </h1>
            <Link href="/movies" className="font-serif text-yellow-400 font-bold w-full sm:w-auto">
              <button className="w-full sm:w-auto p-2 bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 text-white rounded-md">
                Browse Movies
              </button>
            </Link>
          </div>
          {user && (
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <span className="text-gray-600 text-center sm:text-left">
                Welcome{" "}
                <span className="font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 bg-clip-text text-transparent">
                  {user.name}
                </span>
              </span>
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}