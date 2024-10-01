import { useEffect, useState } from "react";
import ProjectCard from "./ProjectCard";
import { ListItem, Project } from "../types";
import { waveform } from "ldrs";
import { orderBy } from "lodash";
import { useNavigate } from "react-router-dom";

interface Props {
	activeSort: string;
	sortAscending: boolean;
	darkMode: boolean;
}

export default function ProjectList(props: Props) {
	const { activeSort, sortAscending, darkMode } = props;

	const [projects, setProjects] = useState<Project[]>();
	const navigate = useNavigate();

	//needed for loader
	waveform.register();

	useEffect(() => {
		const getData = async () => {
			const response = await fetch("http://localhost:4000/api/projects", {
				credentials: "include",
			});
			const data = await response.json();

			if (data.error === "Cound not authenticate user") {
				navigate("/");
			}

			if (response.ok) {
				setProjects(data);
			}
		};

		getData();
	}, []);

	function getCompletionPercent(project: Project) {
		// for projects without a checklist to be at the bottom when sorting by Completion %
		if (project.checklist.length < 1) {
			return -1;
		}

		let checked = 0;

		project.checklist.forEach((item: ListItem) =>
			item.isCompleted ? (checked = checked + 1) : null
		);

		return (checked / project.checklist.length) * 100;
	}

	function getSortedProjects() {
		// types come from orderBy documentation so TS doesn't get mad at me
		let criteria: Array<any> | Function | Object | string;

		switch (activeSort) {
			case "Date Updated":
				criteria = "updatedAt";
				break;
			case "Date Created":
				criteria = "createdAt";
				break;
			case "Title":
				criteria = (project: Project) => project.title.toLowerCase();
				break;
			case "Priority":
				criteria = "priority";
				break;
			case "Due Date":
				criteria = "dueDate";
				break;
			case "Completion %":
				criteria = (project: Project) => getCompletionPercent(project);
				break;
			default:
				criteria = "createdAt";
		}

		return orderBy(
			projects,
			[criteria],
			// list displays first item to last item so order is opposite of intuition
			[sortAscending ? "desc" : "asc"]
		);
	}

	// i have no clue why this error is happening or how to fix it...
	const sortedProjects: Project[] = getSortedProjects();

	//console.log(projects);
	return (
		<div className="flex flex-col  md:flex-row flex-wrap gap-4 items-center justify-center">
			{!projects && (
				<div className="text-center mt-64">
					<l-waveform
						size="100"
						stroke="7.5"
						speed=".25"
						color={darkMode ? "#d8dbe2" : "#0e0920"}
					></l-waveform>
				</div>
			)}
			{projects &&
				sortedProjects.map((project: Project) => (
					<ProjectCard key={project._id} project={project} darkMode={darkMode} />
				))}
		</div>
	);
}
