import React, { useState } from "react";
import "../../src/style.css";

const initialData = [
  {
    label: "Electronics",
    value: 1580,
    originalValue: 1580,
    children: [
      { label: "Phones", value: 880, originalValue: 880 },
      { label: "Laptops", value: 700, originalValue: 700 },
    ],
  },
  {
    label: "Furniture",
    value: 1000,
    originalValue: 1000,
    children: [
      { label: "Tables", value: 300, originalValue: 300 },
      { label: "Chairs", value: 700, originalValue: 700 },
    ],
  },
];

const HierarchicalTable = () => {
  const [data, setData] = useState(initialData);
  const [inputValues, setInputValues] = useState({});

  const updateValue = (parentLabel, label, newValue) => {
    const updatedData = data.map((category) => {
      if (category.label === parentLabel) {
        const updatedChildren = category.children.map((child) =>
          child.label === label ? { ...child, value: newValue } : child
        );
        const newParentValue = updatedChildren.reduce((acc, cur) => acc + cur.value, 0);
        return { ...category, value: newParentValue, children: updatedChildren };
      }
      return category;
    });
    setData(updatedData);
  };

  const updateCategory = (categoryLabel, newValue) => {
    const updatedData = data.map((category) => {
      if (category.label === categoryLabel) {
        const totalCurrent = category.children.reduce((acc, cur) => acc + cur.value, 0);
        const updatedChildren = category.children.map((child) => {
          const newChildValue = (child.value / totalCurrent) * newValue;
          return { ...child, value: Math.round(newChildValue * 100) / 100 };
        });
        return { ...category, value: newValue, children: updatedChildren };
      }
      return category;
    });
    setData(updatedData);
  };

  const handleAllocationPercent = (categoryLabel, childLabel, percentage) => {
    if (isNaN(percentage) || percentage <= 0) {
      alert("Please enter a valid positive percentage.");
      return;
    }

    const updatedData = data.map((category) => {
      if (category.label === categoryLabel) {
        const updatedChildren = category.children.map((child) => {
          if (child.label === childLabel) {
            const newValue = child.value + (child.value * (percentage / 100));
            return { ...child, value: newValue };
          }
          return child;
        });
        const newParentValue = updatedChildren.reduce((acc, cur) => acc + cur.value, 0);
        return { ...category, value: newParentValue, children: updatedChildren };
      }
      return category;
    });
    setData(updatedData);
  };

  const handleAllocationVal = (categoryLabel, childLabel, newValue) => {
    if (isNaN(newValue) || newValue <= 0) {
      alert("Please enter a valid positive value.");
      return;
    }

    const updatedData = data.map((category) => {
      if (category.label === categoryLabel) {
        const updatedChildren = category.children.map((child) => {
          if (child.label === childLabel) {
            return { ...child, value: newValue };
          }
          return child;
        });
        const newParentValue = updatedChildren.reduce((acc, cur) => acc + cur.value, 0);
        return { ...category, value: newParentValue, children: updatedChildren };
      }
      return category;
    });
    setData(updatedData);
  };

  const handleInputChange = (rowLabel, isCategory, value) => {
    if (isNaN(value) || value < 0) {
      alert("Please enter a valid positive number.");
      return;
    }

    setInputValues((prev) => {
      const updatedInputValues = { ...prev };
      if (isCategory) {
        updatedInputValues[rowLabel] = value;
      } else {
        updatedInputValues[`${rowLabel}-child`] = value;
      }
      return updatedInputValues;
    });
  };

  const calculateVariance = (originalValue, currentValue) => {
    if (!originalValue || !currentValue) return 0;
    return ((currentValue - originalValue) / originalValue) * 100;
  };

  const grandTotal = data.reduce((total, category) => {
    return total + category.value + category.children.reduce((subTotal, child) => subTotal + child.value, 0);
  }, 0);

  return (
    <div className="table-container">
      <table className="styled-table">
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((category) => (
            <>
              <tr key={category.label}>
                <td className="parent">{category.label}</td>
                <td>{category.value}</td>
                <td></td> {/* No input for parent rows */}
                <td></td>
                <td></td>
                <td>{calculateVariance(category.originalValue, category.value).toFixed(2)}%</td>
              </tr>
              {category.children.map((child) => (
                <tr key={child.label}>
                  <td className="child">-- {child.label}</td>
                  <td>{child.value}</td>
                  <td>
                    <input
                      className="input-field"
                      type="number"
                      value={inputValues[`${child.label}-child`] || ""}
                      onChange={(e) => handleInputChange(child.label, false, parseFloat(e.target.value))}
                    />
                  </td>
                  <td>
                    <button
                      className="allocate-button"
                      onClick={() => handleAllocationPercent(category.label, child.label, parseFloat(inputValues[`${child.label}-child`] || 0))}
                    >
                      Allocate %
                    </button>
                  </td>
                  <td>
                    <button
                      className="allocate-button"
                      onClick={() => handleAllocationVal(category.label, child.label, parseFloat(inputValues[`${child.label}-child`] || 0))}
                    >
                      Allocate Val
                    </button>
                  </td>
                  <td>{calculateVariance(child.originalValue, child.value).toFixed(2)}%</td>
                </tr>
              ))}
            </>
          ))}
          <tr>
            <td><strong>Grand Total</strong></td>
            <td><strong>{grandTotal}</strong></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HierarchicalTable;