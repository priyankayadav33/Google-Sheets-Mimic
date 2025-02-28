export const evaluateFormula = (formula, getCellValue) => {
  if (!formula.startsWith("=")) return formula; // Return raw value if not a formula

  try {
    // Remove `=` and normalize formula
    let expression = formula.slice(1).toUpperCase();

    // Handle SUM, AVERAGE, MIN, MAX
    expression = expression.replace(/SUM\((.*?)\)/g, (_, range) => sumCells(range, getCellValue));
    expression = expression.replace(/AVERAGE\((.*?)\)/g, (_, range) => averageCells(range, getCellValue));
    expression = expression.replace(/MIN\((.*?)\)/g, (_, range) => minCells(range, getCellValue));
    expression = expression.replace(/MAX\((.*?)\)/g, (_, range) => maxCells(range, getCellValue));

    // Replace cell references (A1, B2) with actual values
    expression = expression.replace(/[A-Z]\d+/g, (match) => {
      const value = getCellValue(match);
      return isNaN(value) ? 0 : value; // Default to 0 if NaN
    });

    // Evaluate the final expression safely
    return new Function(`return ${expression}`)();
  } catch (error) {
    return "ERROR";
  }
};

// Helper functions for SUM, AVERAGE, MIN, MAX
const sumCells = (range, getCellValue) => {
  const cells = getRangeCells(range, getCellValue);
  return cells.reduce((sum, val) => sum + val, 0);
};

const averageCells = (range, getCellValue) => {
  const cells = getRangeCells(range, getCellValue);
  return cells.length ? sumCells(range, getCellValue) / cells.length : 0;
};

const minCells = (range, getCellValue) => {
  return Math.min(...getRangeCells(range, getCellValue));
};

const maxCells = (range, getCellValue) => {
  return Math.max(...getRangeCells(range, getCellValue));
};

// Extracts values from a range (e.g., "A1:B2")
const getRangeCells = (range, getCellValue) => {
  const [start, end] = range.split(":");
  if (!start || !end) return [0];

  const startCol = start[0], startRow = parseInt(start.slice(1));
  const endCol = end[0], endRow = parseInt(end.slice(1));

  let values = [];
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol.charCodeAt(0); col <= endCol.charCodeAt(0); col++) {
      const cell = String.fromCharCode(col) + row;
      values.push(parseFloat(getCellValue(cell)) || 0);
    }
  }
  return values;
};
