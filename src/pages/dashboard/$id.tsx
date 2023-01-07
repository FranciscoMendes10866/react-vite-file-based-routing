import React from "react";
import { useParams } from "react-router-dom";

const DynamicDashboard = () => {
  const { id } = useParams();

  return <div>Dynamic Dashboard Page, Param: {id}</div>;
};

export default DynamicDashboard;
