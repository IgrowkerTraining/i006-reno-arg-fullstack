import React, { useState, useEffect } from "react";
import { useLocation} from "react-router-dom";
import ReportIAView from "../components/IAreport/ReportIAView";

const ReporteIA: React.FC = () => {

  const [dataAnalysis, setDataAnalysis] = useState(null)

  const location = useLocation();
  const { analysis, month, year } = location.state || {};

  useEffect(() => {
    console.log("desde reporteIAobra", analysis);
    
    if (analysis) {
      setDataAnalysis(analysis)
    }
  }, [analysis])


  if (!analysis || !dataAnalysis ) {
    return <p>No hay análisis disponible</p>;
  }
  

  return (
    <ReportIAView
      dataAnalysis={dataAnalysis}
      month={month}
      year={year}
    /> 
  )
}


export default ReporteIA;

