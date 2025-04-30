
// This page is a redirect to the HomePage component
import { Navigate } from "react-router-dom";

const Index = () => {
  return <Navigate to="/home" replace />;
};

export default Index;
