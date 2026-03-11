import React, { useState, useEffect } from 'react'
import ReportIAView from '../components/IAreport/ReportIAView';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

const ReporteIAObraHistorialDetalle = () => {
    const { analysisId } = useParams<{ analysisId: string }>();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!analysisId) return;

        const loadReport = async () => {
            setLoading(true)
            const response = await api.getAnalysisById(analysisId);
            setReport(response);
            setLoading(false)
        };

        loadReport();

    }, [analysisId]);

     if (loading) {
    return <div className="flex items-center justify-center h-[650px]">
      <p className="text-xl font-medium text-primary">Cargando reporte IA...</p>
    </div>
  }

    return (
        <ReportIAView
            dataAnalysis={report}
        />
    )
}

export default ReporteIAObraHistorialDetalle


