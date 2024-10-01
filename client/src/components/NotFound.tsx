interface Props {
	darkMode: boolean;
	toggleDarkMode: Function;
}

export default function NotFound(props: Props) {
	const { darkMode } = props;

	return (
		<div className="flex flex-col justify-center items-center h-screen p-8">
			<h1 className="text-2xl">
				Page not found! <br /> Please double-check the link and try again.{" "}
			</h1>
		</div>
	);
}
