import {
	Button,
	ButtonGroup,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/react";
import DownIcon from "./icons/DownIcon";
import ArrowAscendingIcon from "./icons/ArrowAscendingIcon";
import ArrowDescendingIcon from "./icons/ArrowDescendingIcon";

interface Props {
	activeSort: string;
	setActiveSort: Function;
	sortAscending: boolean;
	setSortAscending: Function;
	darkMode: boolean;
}

export default function SortButton(props: Props) {
	const { activeSort, setActiveSort, sortAscending, setSortAscending, darkMode } =
		props;

	return (
		<ButtonGroup variant="flat">
			<Button
				className="bg-transparent border border-content1 font-semibold"
				onPress={() => setSortAscending(!sortAscending)}
				startContent={
					sortAscending ? (
						<ArrowAscendingIcon color={darkMode ? "#d8dbe2" : "#0e0920"} />
					) : (
						<ArrowDescendingIcon color={darkMode ? "#d8dbe2" : "#0e0920"} />
					)
				}
				aria-label="Change sort order"
			>
				{activeSort}
			</Button>
			<Dropdown
				placement="bottom-end"
				classNames={{ content: "bg-background dark:bg-background" }}
			>
				<DropdownTrigger>
					<Button
						isIconOnly
						className="bg-transparent border border-content1"
						aria-label="Open sorting options"
					>
						<DownIcon color={darkMode ? "#d8dbe2" : "#0e0920"} />
					</Button>
				</DropdownTrigger>
				<DropdownMenu
					className="text-content1 font-semibold"
					disallowEmptySelection
					aria-label="Sorting options"
					selectedKeys={activeSort}
					selectionMode="single"
					// gets the strings of keys instead of keys themselves to make sorting easier in ProjectList
					onAction={(key) => {
						setActiveSort(key.toString());
						switch (key.toString()) {
							case "Priority":
							case "Date Created":
							case "Date Updated":
							case "Completion %":
								setSortAscending(true);
								break;

							default:
								setSortAscending(false);
						}
					}}
				>
					<DropdownItem key="Date Updated">Date Updated</DropdownItem>
					<DropdownItem key="Date Created">Date Created</DropdownItem>
					<DropdownItem key="Title">Title</DropdownItem>
					<DropdownItem key="Priority">Priority</DropdownItem>
					<DropdownItem key="Due Date">Due Date</DropdownItem>
					<DropdownItem key="Completion %">Completion %</DropdownItem>
				</DropdownMenu>
			</Dropdown>
		</ButtonGroup>
	);
}
