// Spreadsheet.js (using Handsontable)

import React, { useRef, useEffect, useState } from 'react';
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.css';
import { evaluateFormula } from '../utils/formulaParser'; // Import your formula parser
import { dataUtils } from '../utils/dataUtils'; // Import data manipulation utilities

function Spreadsheet() {
  const hotRef = useRef(null);
  const [data, setData] = useState([['', '', '', '', ''], ['', '', '', '', ''], ['', '', '', '', '']]); // Initial data
  const [hotInstance, setHotInstance] = useState(null);

  useEffect(() => {
    const container = hotRef.current;
    const hot = new Handsontable(container, {
      data: data,
      rowHeaders: true,
      colHeaders: true,
      contextMenu: true,
      afterChange: (changes, source) => {
        if (source === 'loadData') {
          return; // Prevent infinite loop on initial load
        }
        if (changes) {
          changes.forEach(([row, prop, oldValue, newValue]) => {
            if (newValue.startsWith('=')) {
              // Handle formula input
              const result = evaluateFormula(newValue, hot.getData());
              hot.setDataAtCell(row, prop, result);
            }
            updateDependencies(hot); // Update dependencies after each change
          });
          setData(hot.getData());
        }
      },
    });
    setHotInstance(hot);

    return () => {
      if (hot) {
        hot.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if(hotInstance){
      hotInstance.loadData(data);
    }
  }, [data, hotInstance])

  const updateDependencies = (hot) => {
    // Implement logic to update cells dependent on changed cells
    // This will involve traversing the dependency graph and recalculating formulas.
    const allFormulas = {};
    const dependencyGraph = {};

    hot.getData().forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (typeof cell === 'string' && cell.startsWith('=')) {
          allFormulas[`${Handsontable.helpers.intToChar(colIndex)}${rowIndex + 1}`] = cell;

          const dependencies = findCellDependencies(cell);
          dependencies.forEach(dep => {
            if (!dependencyGraph[dep]) {
              dependencyGraph[dep] = [];
            }
            dependencyGraph[dep].push(`${Handsontable.helpers.intToChar(colIndex)}${rowIndex + 1}`);
          });
        }
      });
    });

    Object.keys(dependencyGraph).forEach(changedCell => {
      dependencyGraph[changedCell].forEach(dependentCell => {
        const [col, row] = Handsontable.helpers.cellCoordFromString(dependentCell);
        const formula = allFormulas[dependentCell];
        const result = evaluateFormula(formula, hot.getData());
        hot.setDataAtCell(row, col, result);
      });
    });
  };

  const findCellDependencies = (formula) => {
    const cellRegex = /[A-Z]+\d+/g;
    const matches = formula.match(cellRegex) || [];
    return matches;
  };

  const handleToolbarAction = (action, value) => {
    if (!hotInstance) return;

    const selectedCells = hotInstance.getSelected();
    if (!selectedCells) return;

    selectedCells.forEach(([startRow, startCol, endRow, endCol]) => {
      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          let cellValue = hotInstance.getDataAtCell(row, col);

          switch (action) {
            case 'bold':
              hotInstance.setCellMeta(row, col, 'className', 'bold');
              hotInstance.render();
              break;
            case 'italic':
              hotInstance.setCellMeta(row, col, 'className', 'italic');
              hotInstance.render();
              break;
            case 'fontSize':
              hotInstance.setCellMeta(row, col, 'cellStyle', { fontSize: `${value}px` });
              hotInstance.render();
              break;
            case 'textColor':
              hotInstance.setCellMeta(row, col, 'cellStyle', { color: value });
              hotInstance.render();
              break;
            case 'trim':
              cellValue = dataUtils.trim(cellValue);
              hotInstance.setDataAtCell(row, col, cellValue);
              break;
            case 'upper':
              cellValue = dataUtils.upper(cellValue);
              hotInstance.setDataAtCell(row, col, cellValue);
              break;
            case 'lower':
              cellValue = dataUtils.lower(cellValue);
              hotInstance.setDataAtCell(row, col, cellValue);
              break;
            default:
              break;
          }
        }
      }
    });
  };

  return <div ref={hotRef} />;
}

export default Spreadsheet;
