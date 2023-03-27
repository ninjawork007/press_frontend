import { ExclamationCircleIcon } from "@heroicons/react/outline";
import classNames from "classnames";
export default function AlertMessage({ title, status, children }) {
  return (
    <div
      className={classNames(
        "border px-4 py-5 rounded-lg sm:px-6 mb-4",
        status == "alert" && "bg-amber-50 border-amber-500",
        status == "default" && "bg-blue-50 border-blue-500"
      )}
    >
      <div className="flex items-start justify-start gap-4">
        <ExclamationCircleIcon
          className={classNames(
            "w-5 h-5 flex-none",
            status == "alert" && "text-amber-700"
          )}
        />
        <div className={classNames(status == "alert" && " text-amber-700")}>
          <p className="font-bold">{title}</p>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
