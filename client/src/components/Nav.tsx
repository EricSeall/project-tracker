import { Button, Navbar, NavbarContent } from "@nextui-org/react";
import Cookies from "js-cookie";
import DarkIcon from "./icons/DarkIcon";
import LightIcon from "./icons/LightIcon";

interface Props {
	title: String;
	toggleDarkMode: Function;
	darkMode: boolean;
}

export default function Nav(props: Props) {
	const { title, toggleDarkMode, darkMode } = props;

	async function removeCookies() {
		await Cookies.remove("token", { path: "/" });
		await Cookies.remove("refresh_token", { path: "/" });
	}

	async function logOut() {
		removeCookies();
		window.location.reload();
	}

	return (
		<>
			<Navbar isBlurred className="flex items-center justify-center text-content1">
				<NavbarContent justify="center">
					<h1 className="text-2xl font-bold">{title}</h1>
				</NavbarContent>
				<NavbarContent justify="center">
					<Button isIconOnly className="bg-transparent" onClick={() => toggleDarkMode()}>
						{darkMode ? <LightIcon /> : <DarkIcon />}
					</Button>
					<a className="font-semibold cursor-pointer" onClick={logOut}>
						Log Out
					</a>
				</NavbarContent>
			</Navbar>
		</>
	);
}
