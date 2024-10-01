import { Project } from "../types";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CircularProgress,
	Divider,
} from "@nextui-org/react";
import PlayIcon from "./icons/PlayIcon";
import { Link as RouterLink } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface Props {
	project: Project;
	darkMode: boolean;
}

export default function ProjectCard(props: Props) {
	const { title, priority, dueDate, streamLink, _id, checklist } = props.project;
	const { darkMode } = props;

	function getCompletionPercent() {
		let checked = 0;

		checklist.forEach((item) =>
			item.isCompleted ? (checked = checked + 1) : null
		);

		return (checked / checklist.length) * 100;
	}

	const completionPercent = getCompletionPercent();

	function getProgressColor() {
		const progress = completionPercent;
		if (0 < progress && progress <= 33) {
			return "stroke-red-400";
		}
		if (33 < progress && progress <= 66) {
			return "stroke-yellow-400";
		}
		if (66 < progress && progress <= 100) {
			return "stroke-green-400";
		}
	}

	function prioritySwitch(prio: Number) {
		switch (prio) {
			case 0:
				return "Low Priority";
			case 1:
				return "Med Priority";
			case 2:
				return "High Priority";
		}
	}

	return (
		<Card
			isPressable
			radius="lg"
			className="w-3/4 bg-foreground max-w-96 h-40"
			shadow="lg"
			as={RouterLink}
			to={"/projects/" + _id}
		>
			<CardHeader className="flex justify-between text-2xl font-bold text-content1">
				<p>{title}</p>
				<div className="w-fit">
					{streamLink && (
						<form target="_blank" action={streamLink}>
							<Button className="bg-transparent" type="submit" isIconOnly>
								<PlayIcon color={darkMode ? "#d8dbe2" : "#0e0920"} />
							</Button>
						</form>
					)}
				</div>
			</CardHeader>
			<Divider />
			<CardBody className="justify-between flex-row text-content1 font-semibold">
				<div className="flex flex-col w-fit justify-center">
					<p>{prioritySwitch(priority)}</p>
					{dueDate && (
						<p>Due {formatDistanceToNow(dueDate.toString(), { addSuffix: true })}</p>
					)}
				</div>
				{checklist.length > 0 && (
					<CircularProgress
						aria-label="Completion Progress"
						className="scale-125"
						classNames={{
							indicator: getProgressColor(),
							track: "stroke-content1/40",
							svg: "drop-shadow-md",
							value: "font-semibold",
						}}
						size="lg"
						value={completionPercent}
						showValueLabel={true}
					/>
				)}
			</CardBody>
		</Card>
	);
}
