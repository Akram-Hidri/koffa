
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-koffa-beige-light p-6">
      <Logo size="md" className="mb-6" />
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-koffa-green">404</h1>
        <p className="text-xl text-koffa-green-dark mb-8">Oops! Page not found</p>
        <Button asChild className="bg-koffa-green hover:bg-koffa-green-dark text-white">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
