import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
	return Cookies.get("refresh_token") ? children : <Navigate to="/" />;
}
