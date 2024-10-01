import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

export default function PrivateRoute(props: any) {
	return Cookies.get("refresh_token") ? props.children : <Navigate to="/" />;
}
