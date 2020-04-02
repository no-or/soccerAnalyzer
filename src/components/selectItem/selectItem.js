import React from "react";
import Select from "@paprika/select";
import PropTypes from "prop-types";
import "./selectItem.css";

export default function SelectItem({
  category,
  items,
  selectedItem,
  onChange
}) {
  return (
    <div className="select-container">
      <span className="select-label">{category}:</span>
      <Select
        className="select-dropdown"
        placeholder={`Select ${category}`}
        onChange={e => onChange(e.target.value)}
        value={selectedItem}
      >
        {items.map(item => {
          console.log(item);
          return <option value={item}>{item}</option>;
        })}
      </Select>
    </div>
  );
}

SelectItem.propTypes = {
  category: PropTypes.string,
  items: PropTypes.array,
  selectedItem: PropTypes.string,
  onChange: PropTypes.func
};
