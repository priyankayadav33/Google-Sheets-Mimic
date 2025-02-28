import React, { useState } from "react";

const Cell = ({ row, col, value, onCellChange, isSelected, onSelect }) => {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || "");

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
    onCellChange(row, col, inputValue);
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div
      className={`cell ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(row, col)}
      onDoubleClick={handleDoubleClick}
    >
      {editing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
};

export default Cell;
