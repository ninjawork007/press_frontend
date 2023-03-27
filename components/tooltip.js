import React, { useState } from "react";

const Tooltip = (props) => {
  const [active, setActive] = useState(false);

//   const showTip = () => {

//       setActive(true);

//   };

//   const hideTip = () => {
//     setActive(false);
//   };

  return (
    <div
      className="Tooltip-Wrapper"
      // When to show the tooltip
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => setActive(!active)}
    >
      {/* Wrapping */}
      {props.children}
      {active && (
        <div className={`Tooltip-Tip ${props.direction || "top"}`}>
          {/* Content */}
          {props.content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
