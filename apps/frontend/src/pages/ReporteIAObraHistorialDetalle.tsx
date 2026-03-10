import React, { useState, useEffect } from 'react'
import ReportIAView from '../components/IAreport/ReportIAView';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';

const ReporteIAObraHistorialDetalle = () => {
    const { analysisId } = useParams<{ analysisId: string }>();
    const [report, setReport] = useState(null);

    useEffect(() => {
        if (!analysisId) return;

        const loadReport = async () => {
            const response = await api.getAnalysisById(analysisId);
            setReport(response);
        };

        loadReport();

    }, [analysisId]);

    if (!report) return <p>Cargando reporte...</p>;

    return (
        <ReportIAView
            dataAnalysis={report}
        />
    )
}

export default ReporteIAObraHistorialDetalle


