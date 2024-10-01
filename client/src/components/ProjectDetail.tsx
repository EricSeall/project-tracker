import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ListItem, Project } from "../types";
import Nav from "./Nav";
import {
	Button,
	DatePicker,
	Divider,
	Input,
	Radio,
	RadioGroup,
	Textarea,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
} from "@nextui-org/react";
import BackIcon from "./icons/BackIcon";
import { parseDate } from "@internationalized/date";
import { Link as RouterLink } from "react-router-dom";
import EditIcon from "./icons/EditIcon";
import CloseIcon from "./icons/CloseIcon";
import { sortBy } from "lodash";
import ProjectChecklistItem from "./ProjectChecklistItem";
import ProjectChecklistNewItem from "./ProjectChecklistNewItem";

interface Props {
	darkMode: boolean;
	toggleDarkMode: Function;
}

export default function ProjectDetail(props: Props) {
	const { darkMode, toggleDarkMode } = props;

	// for deletion confirmation modal
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [project, setProject] = useState<Project>();
	const [editMode, setEditMode] = useState(false);

	const [title, setTitle] = useState("");
	const [streamLink, setStreamLink] = useState("");
	const [priority, setPriority] = useState(0);
	const [dueDate, setDueDate] = useState<string | null>(null);
	const [description, setDescription] = useState("");
	const [checklist, setChecklist] = useState<ListItem[]>([]);

	const [error, setError] = useState(null);
	const navigate = useNavigate();

	let params = useParams();

	const getData = async () => {
		const response = await fetch(
			`http://localhost:4000/api/projects/${params.id}`,
			{
				credentials: "include",
			}
		);
		const data = await response.json();

		if (data.error === "Cound not authenticate user") {
			navigate("/");
		}

		if (
			data.error === "Invalid ID Format" ||
			data.error === "Access Denied" ||
			data.error === "Project not found"
		) {
			navigate("*");
		}

		if (!response.ok) {
			return setError(data.error);
		}

		if (response.ok) {
			setProject(data);
			setTitle(data.title);
			setStreamLink(data.streamLink);
			setPriority(data.priority);
			setDueDate(data.dueDate);
			setDescription(data.description);
			// uses lodash to sort list initially
			setChecklist(sortBy(data.checklist, ["isCompleted", "updatedAt"]));
		}

		// TODO: handle errors somehow
	};

	// grab data on first load
	useEffect(() => {
		getData();
	}, []);

	const handleSubmit = async (e?: React.FormEvent) => {
		if (e) {
			e.preventDefault();
		}

		const updatedProject = {
			title,
			streamLink,
			priority,
			dueDate,
			description,
			checklist,
		};

		const response = await fetch(
			`http://localhost:4000/api/projects/${project?._id}`,
			{
				method: "PATCH",
				body: JSON.stringify(updatedProject),
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const json = await response.json();

		if (!response.ok) {
			return setError(json.error);
		}
		if (response.ok) {
			setEditMode(false);
			setError(null);
		}
	};

	const handleCheck = async (id: string) => {
		let list = checklist.map((item) => item);
		const activeItem = list.find((item) => item._id === id);

		if (activeItem) {
			activeItem.isCompleted = !activeItem.isCompleted;
		}

		const updatedProject = {
			checklist: list,
		};

		// PATCH Request
		const response = await fetch(
			`http://localhost:4000/api/projects/${project?._id}`,
			{
				method: "PATCH",
				body: JSON.stringify(updatedProject),
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const json = await response.json();

		if (!response.ok) {
			return setError(json.error);
		}

		setChecklist(sortBy(list, ["isCompleted", "updatedAt"]));

		setError(null);
	};

	const handleEditItem = async (
		element: HTMLElement,
		id: string,
		newText: string
	) => {
		let oldContent = checklist.find((item) => item._id === id)?.content;

		if (newText === oldContent) {
			return;
		}

		let list = checklist.map((item) => item);
		const activeItem = list.find((item) => item._id === id);
		if (activeItem) {
			activeItem.content = newText;
		}
		element.blur();

		// PATCH Request
		const updatedProject = {
			checklist: list,
		};

		const response = await fetch(
			`http://localhost:4000/api/projects/${project?._id}`,
			{
				method: "PATCH",
				body: JSON.stringify(updatedProject),
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);

		const json = await response.json();

		if (!response.ok) {
			return setError(json.error);
		}

		setChecklist(sortBy(list, ["isCompleted", "updatedAt"]));
		setError(null);
	};

	const handleNewItem = async (element: HTMLInputElement) => {
		const content = element.value;
		if (content === "") {
			return;
		}

		// POST Request
		const response = await fetch(
			`http://localhost:4000/api/projects/${project?._id}/`,
			{
				method: "POST",
				body: content,
				credentials: "include",
				headers: {
					"Content-Type": "text/plain",
				},
			}
		);

		const json = await response.json();

		if (!response.ok) {
			return setError(json.error);
		}
		// sort and add item to list at same time
		setChecklist(
			sortBy(
				[...checklist, { content: element.value, isCompleted: false, _id: json._id }],
				["isCompleted", "updatedAt"]
			)
		);

		setError(null);

		element.value = "";
	};

	const handleDeleteItem = async (listID: string) => {
		// DELETE Request
		const response = await fetch(
			`http://localhost:4000/api/projects/${project?._id}/${listID}`,
			{
				method: "DELETE",
				credentials: "include",
			}
		);

		const json = await response.json();

		if (!response.ok) {
			return setError(json.error);
		}

		let newList = checklist.filter((item) => item._id != listID);

		setChecklist(newList);
		setError(null);
	};

	const handleDeleteProject = async () => {
		// DELETE Request
		const response = await fetch(
			`http://localhost:4000/api/projects/${project?._id}`,
			{
				method: "DELETE",
				credentials: "include",
			}
		);

		const json = await response.json();

		if (!response.ok) {
			setError(json.error);
		}

		setError(null);
	};

	return (
		<>
			<Nav title={title} toggleDarkMode={toggleDarkMode} darkMode={darkMode} />

			<div className="bg-background bg-fixed p-4 min-h-[calc(100vh-4rem)] md:w-1/2 md:min-w-96 md:mx-auto">
				<div className="flex justify-between">
					<Button className="bg-transparent" as={RouterLink} to="/projects" isIconOnly>
						<BackIcon color={darkMode ? "#d8dbe2" : "#0e0920"} />
					</Button>
					<Button
						className="bg-transparent"
						onPress={() => setEditMode(!editMode)}
						isIconOnly
					>
						{editMode ? (
							<CloseIcon color={darkMode ? "#d8dbe2" : "#0e0920"} />
						) : (
							<EditIcon color={darkMode ? "#d8dbe2" : "#0e0920"} />
						)}
					</Button>
				</div>
				{
					// loader
					!project && (
						<div className="text-center mt-64">
							<l-waveform
								size="100"
								stroke="7.5"
								speed=".25"
								color={darkMode ? "#d8dbe2" : "#0e0920"}
							></l-waveform>
						</div>
					)
				}
				{project && (
					<>
						{editMode && (
							<form onSubmit={handleSubmit} className="text-content1 font-semibold">
								<Input
									type="text"
									label="Project Name"
									className="my-8"
									classNames={{ label: "text-xl", input: ["!text-content1"] }}
									variant="flat"
									onChange={(e) => setTitle(e.target.value)}
									value={title}
									isDisabled={!editMode}
									isRequired
								/>
								<Input
									type="text"
									label="Streaming Link"
									className="my-8"
									classNames={{ label: "text-xl", input: ["!text-content1"] }}
									variant="flat"
									onChange={(e) => setStreamLink(e.target.value)}
									value={streamLink}
									isDisabled={!editMode}
								/>
								<RadioGroup
									label="Priority Level"
									orientation="horizontal"
									className="my-8 rounded-medium px-3 py-2 bg-default-100"
									classNames={{ label: "text-xl" }}
									onValueChange={(value) => setPriority(value as unknown as number)}
									value={priority.toString()}
									isDisabled={!editMode}
									isRequired
								>
									<Radio value="0" classNames={{ label: "text-content1" }}>
										Low Priority
									</Radio>
									<Radio value="1" classNames={{ label: "text-content1" }}>
										Med Priority
									</Radio>
									<Radio value="2" classNames={{ label: "text-content1" }}>
										High Priority
									</Radio>
								</RadioGroup>
								<DatePicker
									label={"Due Date"}
									variant="flat"
									className="my-8"
									dateInputClassNames={{
										input: ["!text-content1"],
										label: "text-xl",
									}}
									// date without time components (needed for parseDate)
									value={dueDate ? parseDate(dueDate.split("T")[0]) : null}
									isDisabled={!editMode}
									onChange={(value) => setDueDate(value.toString())}
								/>
								<Textarea
									label="Description"
									placeholder="Enter a description"
									className="mb-8"
									classNames={{ label: "text-xl", input: ["!text-content1"] }}
									minRows={1}
									variant="flat"
									onChange={(e) => setDescription(e.target.value)}
									value={description}
									isDisabled={!editMode}
								/>

								{editMode && (
									<div className="flex justify-between">
										<Button
											type="submit"
											variant="flat"
											className="bg-transparent border border-content1 font-semibold"
										>
											Update Project
										</Button>
										<Button
											color="danger"
											variant="flat"
											className="bg-transparent border border-danger font-semibold"
											onPress={onOpen}
										>
											Delete Project
										</Button>
									</div>
								)}
							</form>
						)}
						{!editMode && (
							<>
								<h2 className="font-bold mt-2 mb-2 text-content1 text-xl">To-Do:</h2>
								<div className="flex flex-col">
									{checklist.map((item) => {
										return (
											<div key={item._id}>
												<ProjectChecklistItem
													item={item}
													handleCheck={handleCheck}
													handleEditItem={handleEditItem}
													handleDeleteItem={handleDeleteItem}
													darkMode={darkMode}
												/>
												<Divider />
											</div>
										);
									})}
									<ProjectChecklistNewItem handleNewItem={handleNewItem} />
								</div>
							</>
						)}
					</>
				)}
			</div>
			{error && <div className="error">{error}</div>}
			<Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								Are you sure you want to delete this project?
							</ModalHeader>
							<ModalBody>
								<p>This action cannot be undone.</p>
							</ModalBody>
							<ModalFooter>
								<Button
									color="danger"
									onPress={handleDeleteProject}
									as={RouterLink}
									to="/projects"
								>
									Delete
								</Button>
								<Button color="primary" onPress={onClose}>
									Close
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
}
