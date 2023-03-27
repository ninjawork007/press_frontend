import {
  CheckIcon as CheckIconSolid,
  ChevronDownIcon,
} from "@heroicons/react/solid";
import { XIcon as XIconSolid } from "@heroicons/react/solid";
import classNames from "classnames";
export default function BulletPoint({ text, isPositive, iconPath }) {
  return (
    <li className="flex space-x-3 items-center">
      <div
        className={classNames(
          "rounded-full p-[6px]",
          isPositive
            ? "bg-[#E6ECFF] text-primary"
            : "bg-[#F1EEF1] text-[#736F87]"
        )}
      >
        {isPositive ? (
          // <CheckIconSolid
          //   className="flex-shrink-0 h-5 w-5"
          //   aria-hidden="true"
          // />
          <img className="flex-shrink-0 h-5 w-5" src={iconPath} alt="Icon" />
        ) : (
          <XIconSolid className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
        )}
      </div>
      <span className="text-lg text-gray-700">{text}</span>
    </li>
  );
}
