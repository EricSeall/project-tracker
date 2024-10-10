import { useState } from "react";
import Nav from "./Nav";
import ProjectList from "./ProjectList";
import PlusIcon from "./icons/PlusIcon";
import { Button } from "@nextui-org/react";
import { Link as RouterLink } from "react-router-dom";
import SortButton from "./SortButton";

interface Props {
  darkMode: boolean;
  toggleDarkMode: Function;
}

export default function Projects(props: Props) {
  const { darkMode, toggleDarkMode } = props;

  const [activeSort, setActiveSort] = useState("Date Updated");
  const [sortAscending, setSortAscending] = useState(true);

  return (
    <>
      <Nav
        title="My Projects"
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
      />
      <div className="bg-background bg-fixed min-h-[calc(100vh-4rem)]">
        <div className="flex justify-between p-4 w-1/2 min-w-96 mx-auto">
          <Button
            className="bg-transparent"
            as={RouterLink}
            to="/create"
            isIconOnly
          >
            <PlusIcon color={darkMode ? "#d8dbe2" : "#0e0920"} />
          </Button>
          <SortButton
            activeSort={activeSort}
            setActiveSort={setActiveSort}
            sortAscending={sortAscending}
            setSortAscending={setSortAscending}
            darkMode={darkMode}
          />
        </div>
        <ProjectList
          activeSort={activeSort}
          sortAscending={sortAscending}
          darkMode={darkMode}
        />
      </div>
    </>
  );
}
