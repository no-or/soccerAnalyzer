import React from "react";
import ResultTable from "../resultTable/resultTable";
import Button from "@paprika/button";
import "./aggregationQuery.css";

const { ipcRenderer } = require("electron");

export default function AggregationQuery() {

  const [average, setAverage] = React.useState([]);

  React.useEffect(() => {
    ipcRenderer.on("getAvgGoalsPerPlayerPerClubReply", (event, data) => {
      setAverage(data);
    });
  }, [])

  const getAvgGoalsPerPlayerPerClub = () => {
    ipcRenderer.send("getAvgGoalsPerPlayerPerClub");
  }

  return (
  <div>
    <h3>Aggregate average goals per player per club:</h3>
    <div class="aggr-container">
    <span class="aggr-label">Aggregate average goals:</span>
    <Button onClick={() => getAvgGoalsPerPlayerPerClub()}>Get Aggregate</Button>
    <ResultTable results={average}/>
    </div>
  </div>
  );
}