import { Navigate } from "react-router-dom";

const SellerProtectedRoute = ({ isSeller, isLoading, children }) => {
  if (isLoading) {
    return null;
  }

  if (!isSeller) {
    return <Navigate to="/shop-login "replace />;
  }

  return children;
};

export default SellerProtectedRoute;