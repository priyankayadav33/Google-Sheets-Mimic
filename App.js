import React, { useState } from "react";
import Toolbar from "./components/Toolbar";
import FormulaBar from "./components/FormulaBar";
import Spreadsheet from "./components/Spreadsheet";
import "./App.css";

const App = () => {
  const [data, setData] = useState({}); // Stores spreadsheet values
  const [selectedCell, setSelectedCell] = useState(null);
  const [formula, setFormula] = useState("");

  // Get value of a cell for formula evaluation
  const getCellValue = (cell) => data[cell] || "0";

  // Handle formula input change
  const handleFormulaChange = (newFormula) => {
    if (!selectedCell) return;
    setFormula(newFormula);

    // Store formula in data
    setData((prev) => ({ ...prev, [selectedCell]: newFormula }));
  };

  // Handle cell value updates
  const handleCellChange = (row, col, newValue) => {
    const key = `${row},${col}`;
    setData((prev) => ({ ...prev, [key]: newValue }));
  };

  // Handle cell selection
  const handleSelectCell = (row, col) => {
    const key = `${row},${col}`;
    setSelectedCell(key);
    setFormula(data[key] || "");
  };

  return (
    <div className="app">
      <Toolbar 
        onFormatChange={(format) => console.log("Apply format:", format)}
        onClearCell={() => selectedCell && handleCellChange(selectedCell.split(",")[0], selectedCell.split(",")[1], "")}
      />
      <FormulaBar
        selectedCell={selectedCell}
        formula={formula}
        onFormulaChange={handleFormulaChange}
      />
      <Spreadsheet
        data={data}
        onCellChange={handleCellChange}
        onSelectCell={handleSelectCell}
        selectedCell={selectedCell}
      />
    </div>
  );
};

export default App;
