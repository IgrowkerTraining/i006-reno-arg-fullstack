import { Flower } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import { useParams } from "react-router-dom";



const ReporteIA: React.FC = () => {

   const { obraId } = useParams<string>();
   const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);


  console.log({analysis});
  

  const reportRef = useRef<HTMLDivElement>(null);


  if (!obraId) return <p>Cargando...</p>;
  return (
     <div ref={reportRef}>
      <h3 className="flex items-center gap-2 text-secondary-plus font-bold text-2xl"><Flower size={20} /> REPORTE IA</h3>
      <header className="flex items-end gap-6 mt-4">
        <div>
        <h2 className="font-bold text-2xl my-2">{analysis.codigo}</h2>
        <h4 className="font-bold">{analysis.proyecto} - Periodo: {analysis.periodo}</h4>
        </div>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
       
      </section>
    </div>
  );
};

export default ReporteIA;

