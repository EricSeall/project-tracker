interface Props {
  color: string;
}

export default function BackIcon(props: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
    >
      <g id="SVGRepo_iconCarrier">
        <path
          d="M14.5 17L9.5 12L14.5 7"
          stroke={props.color}
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </g>
    </svg>
  );
}
