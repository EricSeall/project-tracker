import { Button, Link } from "@nextui-org/react";
import DiscordIcon from "./icons/DiscordIcon";

export default function Login() {
	function determineLink() {
		if (import.meta.env.VITE_ENV == "dev") {
			return "https://discord.com/oauth2/authorize?client_id=1285284725241413643&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A4000%2Fapi%2Fauth%2Fdiscord%2Fredirect&scope=email+identify";
		}

		if (import.meta.env.VITE_ENV == "prod") {
			return "https://discord.com/oauth2/authorize?client_id=1285284725241413643&response_type=code&redirect_uri=https%3A%2F%2Fserver.aceauramusic.com%2Fapi%2Fauth%2Fdiscord%2Fredirect&scope=identify+email";
		}
	}

	const oauthLink = determineLink();

	return (
		<div className="flex flex-col h-screen items-center justify-center gap-16">
			<h1 className="block font-semibold text-3xl">Ace Aura's Project Tracker</h1>
			<Button
				startContent={<DiscordIcon />}
				as={Link}
				size="lg"
				className="w-fit"
				href={oauthLink}
			>
				Sign in with Discord
			</Button>
		</div>
	);
}
