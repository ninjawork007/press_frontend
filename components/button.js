/* This example requires Tailwind CSS v2.0+ */
import classNames from "classnames"

export default function Example({className, title, isPrimary}) {
    return (
      <>
        <button
          type="button"
          className={classNames("inline-flex items-center px-8 py-5 border border-transparent text-sm font-bold rounded-full shadow-sm text-white",
          isPrimary ? "bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" : "border-[#AEBBFE] hover:bg-white hover:text-primary text-white ", className)}
        >
          {title}
        </button>
      </>
    )
  }
  