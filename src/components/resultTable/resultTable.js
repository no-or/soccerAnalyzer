import React from "react";
import "./resultTable.css";

function TableHeader({ results }) {
  let header = Object.keys(results[0]);
  return header.map((key, index) => {
    return <th key={index}>{key.toUpperCase()}</th>;
  });
}

function TableData({ results }) {
  return results.map(result => {
    const { id } = result;
    return (
      <tr key={id}>
        <TableAttributes result={result} />
      </tr>
    );
  });
}

function TableAttributes({ result }) {
  let attributes = Object.keys(result);
  return attributes.map(attribute => {
    return <td>{result[attribute]}</td>;
  });
}

export default function ResultTable({ results }) {
  return (
    <div>
      <table id="results">
        <tbody>
          <tr>
            <TableHeader results={results} />
          </tr>
          <TableData results={results} />
        </tbody>
      </table>
    </div>
  );
}
