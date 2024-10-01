import { Checkbox } from "@nextui-org/react";

interface Props {
	handleNewItem: Function;
}

export default function ProjectChecklistNewItem(props: Props) {
	const { handleNewItem } = props;

	return (
		<div className="flex py-2">
			<Checkbox size="lg" className="ml-2 invisible" />
			<input
				className="bg-transparent border-b-2 text-content1"
				placeholder="New Item"
				onKeyDown={(e) => {
					e.key === "Enter" ? handleNewItem(e.currentTarget) : null;
				}}
			/>
		</div>
	);
}
