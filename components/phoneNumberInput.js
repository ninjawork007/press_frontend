import React, { useEffect, useRef } from "react";

function PhoneNumberInput({ className, ...props }) {
  const inputRef = useRef();

  const isNumericInput = (event) => {
    const key = event.keyCode;
    return (
      (key >= 48 && key <= 57) || // Allow number line
      (key >= 96 && key <= 105) // Allow number pad
    );
  };

  const isModifierKey = (event) => {
    const key = event.keyCode;
    return (
      event.shiftKey === true ||
      key === 35 ||
      key === 36 || // Allow Shift, Home, End
      key === 8 ||
      key === 9 ||
      key === 13 ||
      key === 46 || // Allow Backspace, Tab, Enter, Delete
      (key > 36 && key < 41) || // Allow left, up, right, down
      // Allow Ctrl/Command + A,C,V,X,Z
      ((event.ctrlKey === true || event.metaKey === true) &&
        (key === 65 || key === 67 || key === 86 || key === 88 || key === 90))
    );
  };

  const enforceFormat = (event) => {
    // Input must be of a valid number format or a modifier key, and not longer than ten digits
    if (!isNumericInput(event) && !isModifierKey(event)) {
      event.preventDefault();
    }
  };

  const formatToPhone = (event) => {
    if (isModifierKey(event)) {
      return;
    }

    // I am lazy and don't like to type things more than once
    const target = event.target;
    const input = event.target.value.replace(/\D/g, "").substring(0, 10); // First ten digits of input only
    const zip = input.substring(0, 3);
    const middle = input.substring(3, 6);
    const last = input.substring(6, 10);

    if (input.length > 6) {
      target.value = `(${zip}) ${middle} - ${last}`;
    } else if (input.length > 3) {
      target.value = `(${zip}) ${middle}`;
    } else if (input.length > 0) {
      target.value = `(${zip}`;
    }
  };

  useEffect(() => {
    const inputElement = inputRef.current;
    if (!inputElement) {
      return;
    }
    inputElement.addEventListener("keydown", enforceFormat);
    inputElement.addEventListener("keyup", formatToPhone);

    return () => {
      inputElement.removeEventListener("keydown", enforceFormat);
      inputElement.removeEventListener("keyup", formatToPhone);
    };
  }, []);

  return <input ref={inputRef} type="text" className={className} {...props} />;
}

export default PhoneNumberInput;
