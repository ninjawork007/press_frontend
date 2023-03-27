import { PlusIcon, CheckIcon, ExclamationCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/outline'
import { useEffect, useRef } from 'react';
var classNames = require('classnames');

const Status = {
    Active: 0,
    Pending: 1,
    Alert: 2,
    None: 3,
    Error: 4,
    Special: 5
}

export default function Example({title, status, tooltip}) {
    let uid = useRef(null)

    useEffect(() => {
        const randomNumber = Math.floor(Math.random() * 100)
        uid.current = randomNumber
    }, [])

    const color = () => {
        switch (status) {
            case Status.Active:
                return 'bg-[#ECFDF3] text-[#006B3E]'
            case Status.Pending:
                return 'bg-[#FAF9FA]'
            case Status.Alert:
                return 'bg-[#FFFAEB] text-[#B24100]'
            case Status.Error:
                return 'bg-red-50 text-red-500'
            case Status.Special:
                return 'bg-purple-50 text-purple-500'
            default:
                return 'bg-[#FAF9FA]'
        }
    }

    // const textColor = () => {
    //     switch (status) {
    //         case Status.Active:
    //             return 'text-[#ECFDF3] text-[#006B3E]'
    //         case Status.Pending:
    //             return 'text-[#FAF9FA]'
    //         case Status.Alert:
    //             return 'text-[#FFFAEB]'
    //         default:
    //             return 'text-[#FAF9FA]'
    //     }
    // }

    const icon = () => {
        switch (status) {
            case Status.Active:
                return <CheckIcon className="text-green-500 w-4 h-4" />
            case Status.Pending:
                return <ClockIcon className="text-black w-4 h-4" />
            case Status.Alert:
                return <ExclamationCircleIcon className="text-yellow-500 w-4 h-4" />

            case Status.Special:
                return <img src="/diamond.svg" className="text-purple-500 w-4 h-4" />
            case Status.Error:
                return <XCircleIcon className="text-red-500 w-4 h-4" />
            default:
                return null
        }
    }

  return (
    <>
        <div data-tooltip-target={`tooltip-${uid.current}`} className={classNames('py-1 px-2 rounded-xl flex items-center gap-1 select-none ', color())}>
            <span>{icon()}</span>
            <span className="text-xs font-bold">{title}</span>
        </div>
            <div id={`tooltip-${uid.current}`} role="tooltip" className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700">
            {tooltip}
            <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
    </>

  )
}
