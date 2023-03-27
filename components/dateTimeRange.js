import ReactDatetime from "react-datetime";
import { useEffect, useState } from "react";
export default function DateTimeRange({ startDate, endDate, onDatesChange }) {
  const [startDateValue, setStartDateValue] = useState(startDate);
  const [endDateValue, setEndDateValue] = useState(endDate);

  useEffect(() => {
    onDatesChange({ startDate: startDateValue, endDate: endDateValue });
  }, [startDateValue, endDateValue]);

  const handleStartDateChange = (date) => {
    setStartDateValue(date);
    if (date > endDateValue) {
      let endDateAddDay = date.clone().add(1, "day");
      setEndDateValue(endDateAddDay);
    }
  };

  const handleEndDateChange = (date) => {
    setEndDateValue(date);
    if (date < startDateValue) {
      let startDateSubtractDay = date.clone().subtract(1, "day");
      setStartDateValue(startDateSubtractDay);
    }
  };

  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Start Date</label>
        <ReactDatetime
          value={startDateValue}
          inputProps={{
            className: "input",

            readOnly: true,
            placeholder: "Choose a date",
          }}
          onChange={handleStartDateChange}
          timeFormat={false}
        />
      </div>
      <div className="flex flex-col ml-4">
        <label className="text-sm font-medium text-gray-700">End Date</label>
        <ReactDatetime
          value={endDateValue}
          inputProps={{
            className: "input",

            readOnly: true,
            placeholder: "Choose a date",
          }}
          onChange={handleEndDateChange}
          timeFormat={false}
        />
      </div>
    </div>
  );
}
