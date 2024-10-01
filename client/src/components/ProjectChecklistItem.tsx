import { Button, Checkbox } from "@nextui-org/react";
import { ListItem } from "../types";
import DeleteIcon from "./icons/DeleteIcon";

interface Props {
	item: ListItem;
	handleCheck: Function;
	handleEditItem: Function;
	handleDeleteItem: Function;
	darkMode: boolean;
}

export default function ProjectChecklistItem(props: Props) {
	const { item, handleCheck, handleEditItem, handleDeleteItem, darkMode } = props;

	return (
		<div className="flex justify-between items-center py-2">
			<div>
				<Checkbox
					key={item._id}
					className="ml-2 border-content1"
					classNames={{
						wrapper:
							"text-content1 group-data-[selected=true]:after:bg-foreground before:border-content1",
					}}
					size="lg"
					defaultSelected={item.isCompleted}
					onValueChange={() => handleCheck(item._id)}
				></Checkbox>
				<input
					className="bg-transparent text-content1"
					defaultValue={item.content}
					onKeyDown={(e) => {
						e.key === "Enter"
							? handleEditItem(e.currentTarget, item._id, e.currentTarget.value)
							: null;
					}}
					onBlur={(e) => {
						handleEditItem(e.currentTarget, item._id, e.currentTarget.value);
					}}
				/>
			</div>
			<Button
				className="bg-transparent"
				size="sm"
				onPress={(e) => handleDeleteItem(item._id)}
				isIconOnly
			>
				<DeleteIcon color={darkMode ? "#d8dbe2" : "#0e0920"} />
			</Button>
		</div>
	);
}
