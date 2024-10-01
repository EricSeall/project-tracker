import "./App.css";
import Create from "./components/Create";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Projects from "./components/Projects";
import ProjectDetail from "./components/ProjectDetail";
import Login from "./components/Login";
import PrivateRoute from "./components/auth/PrivateRoute";
import NotFound from "./components/NotFound";
import { useState } from "react";

function App() {
	const [darkMode, setDarkMode] = useState(true);

	function toggleDarkMode() {
		setDarkMode(!darkMode);
	}

	return (
		<BrowserRouter>
			<div className={`app${darkMode ? " dark" : ""} bg-background`}>
				<Routes>
					<Route path="/" element={<Login />} />
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
