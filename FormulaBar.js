import React from "react";
import { TextInput } from "@mantine/core";

const FormulaBar = ({ selectedCell, formula, onFormulaChange }) => {
  return (
    <div className="formula-bar">
      <span className="cell-label">{selectedCell || "A1"}:</span>
      <TextInput
        value={formula}
        onChange={(e) => onFormulaChange(e.target.value)}
        placeholder="Enter a formula or value..."
        className="formula-input"
      />
    </div>
  );
};

export default FormulaBar;
