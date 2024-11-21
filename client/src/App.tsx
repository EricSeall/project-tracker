import "./App.css";
import Create from "./components/Create";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Projects from "./components/Projects";
import ProjectDetail from "./components/ProjectDetail";
import Login from "./components/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
import NotFound from "./components/NotFound";
import Cookies from "js-cookie";
import { useState } from "react";

function App() {
	const [darkMode, setDarkMode] = useState(true);

	function toggleDarkMode() {
		const themeColor = document.querySelector('meta[name="theme-color"]');
		if (themeColor && themeColor.getAttribute("content") == "#0e0920") {
			themeColor.setAttribute("content", "#d8dbe2");
		} else if (themeColor) {
			themeColor.setAttribute("content", "#0e0920");
		}

		setDarkMode(!darkMode);
	}

	return (
		<BrowserRouter>
			<div className={`app${darkMode ? " dark" : ""} bg-background`}>
				<Routes>
					<Route
						path="/"
						element={
							Cookies.get("refresh_token") ? (
								<Projects darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
							) : (
								<Login />
							)
						}
					/>
					<Route
						path="/projects"
						element={
							<PrivateRoute>
								<Projects darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
							</PrivateRoute>
						}
					/>
					<Route
						path="/projects/:id"
						element={
							<PrivateRoute>
								<ProjectDetail darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
							</PrivateRoute>
						}
					/>
					<Route
						path="/create"
						element={
							<PrivateRoute>
								<Create darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
							</PrivateRoute>
						}
					/>
					<Route path="*" element={<NotFound />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
