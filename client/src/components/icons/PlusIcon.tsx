interface Props {
  color: string;
}

export default function PlusIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke={props.color}
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
    >
      <g id="SVGRepo_iconCarrier">
        <path d="M12 6V18" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
        <path d="M6 12H18" strokeLinecap="round" strokeLinejoin="round"></path>{" "}
      </g>
    </svg>
  );
}
