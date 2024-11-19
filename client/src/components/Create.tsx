import React, { useState } from "react";
import Nav from "./Nav";
import {
	Button,
	DatePicker,
	Input,
	Radio,
	RadioGroup,
	Textarea,
} from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import BackIcon from "./icons/BackIcon";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { URL } from "../URL";

interface Props {
	darkMode: boolean;
	toggleDarkMode: Function;
}

export default function Create(props: Props) {
	const { darkMode, toggleDarkMode } = props;

	const [title, setTitle] = useState("");
	const [streamLink, setStreamLink] = useState("");
	const [priority, setPriority] = useState("0");
	const [dueDate, setDueDate] = useState<string | null>(null);
	const [description, setDescription] = useState("");
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const newProject = { title, streamLink, priority, dueDate, description };

		const response = await fetch(`${URL}/api/projects/`, {
			method: "POST",
			body: JSON.stringify(newProject),
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const json = await response.json();

		if (json.error === "Cound not authenticate user") {
			navigate("/");
		}

		if (!response.ok) {
			setError(json.error);
		}
		if (response.ok) {
			setError(null);
			setTitle("");
			setStreamLink("");
			setPriority("0");
			setDueDate(null);
			setDescription("");
			//console.log("new project added");

			navigate("/projects");
		}
	};

	return (
		<div>
			<Nav title="New Project" toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
			<div className="bg-background bg-fixed p-4 min-h-[calc(100vh-4rem)] md:w-1/2 md:min-w-96 md:mx-auto">
				<div className="p-4">
					<Button
						className="bg-transparent mb-8"
						as={RouterLink}
						to="/projects"
						isIconOnly
						aria-label="All projects"
					>
						<BackIcon color={darkMode ? "#d8dbe2" : "#0e0920"} />
					</Button>
				</div>
				<form onSubmit={handleSubmit} className="text-content1 font-semibold">
					<Input
						type="text"
						label="Project Name"
						className="mb-8"
						classNames={{ label: "text-xl", input: ["!text-content1"] }}
						variant="flat"
						onChange={(e) => setTitle(e.target.value)}
						value={title}
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
					/>
					<RadioGroup
						label="Priority Level"
						orientation="vertical"
						className="my-8 rounded-medium px-3 py-2 bg-default-100"
						classNames={{ label: "text-xl" }}
						onValueChange={(value) => setPriority(value)}
						value={priority}
						defaultValue={priority}
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
						label="Due Date"
						variant="flat"
						className="my-8"
						dateInputClassNames={{
							input: ["!text-content1"],
							label: "text-xl",
						}}
						classNames={{ calendarContent: ["!bg-background"] }}
						value={dueDate ? parseDate(dueDate) : null}
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
					/>
					<Button
						type="submit"
						variant="flat"
						className="bg-transparent border border-content1 font-semibold"
						aria-label="Create project"
					>
						Create Project
					</Button>
					{error && <div className="error">{error}</div>}
				</form>
			</div>
		</div>
	);
}
