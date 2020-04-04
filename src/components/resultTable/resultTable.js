import React from "react";
import Button from "@paprika/button";
import "./resultTable.css";

function TableHeader({ results }) {
  let header = Object.keys(results[0]);
  let tableTopRow = header.map((key, index) => {
    return <th key={index}>{key.toUpperCase()}</th>;
  });
  return tableTopRow;
}

function TableData({ results, onUpdate, onDelete }) {
  return results.map(result => {
    const { id } = result;
    console.log("idsssss: " + id);
    return (
      <tr key={id}>
        <TableAttributes result={result} />
        {onUpdate && (
          <td>
            <Button onClick={() => onUpdate(id)}>UPDATE</Button>
          </td>
        )}
        {onDelete && (
          <td>
            <Button onClick={() => onDelete(id)}>DELETE</Button>
          </td>
        )}
      </tr>
    );
  });
}

function TableAttributes({ result }) {
  let attributes = Object.keys(result);
  let row = attributes.map(attribute => {
    return <td>{result[attribute]}</td>;
  });
  return row;
}

export default function ResultTable({ results, onUpdate, onDelete }) {
  return (
    <div>
      <table id="results">
        <tbody>
          <tr>
            <TableHeader
              results={results}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
            {onUpdate && <th key={results.length}>UPDATE</th>}
            {onDelete && <th key={results.length}>DELETE</th>}
          </tr>
          <TableData
            results={results}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </tbody>
      </table>
    </div>
  );
}
