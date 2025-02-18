import { createFileRoute } from "@tanstack/react-router";
import logo from "../../assets/logo.png";

export const Route = createFileRoute("/_nonAuthRoutes/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const handleGoogleLogin = () => {
    const loginUrl = `${import.meta.env.VITE_API_URL}/auth/google/login?state=${
      window.location.origin
    }`;
    window.location.href = loginUrl;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={logo} alt="logo" className="w-80 mb-4" />
      <button
        onClick={handleGoogleLogin}
        className="px-4 py-2 border flex gap-2 cursor-pointer border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150"
      >
        <img
          className="w-6 h-6"
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          loading="lazy"
          alt="google logo"
        />
        <span>Login with Google</span>
      </button>
    </div>
  );
}
