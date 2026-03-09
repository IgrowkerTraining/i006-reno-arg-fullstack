import { Flower } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api';

const ReporteIAObraHistorial: React.FC = () => {

    const { obraId } = useParams<string>();
    const [isLoading, setIsLoading] = useState(false)
    const [iaReports, setIaReports] = useState([])

    useEffect(() => {
        if (!obraId) return;

        const loadProjectHistory = async () => {
            try {
                setIsLoading(true);

                const IAReportHistory = await api.getIAReportsByProjectId(obraId);

                console.log(IAReportHistory.data);

                setIaReports(IAReportHistory.data);
            } catch (error) {
                console.error("Error cargando historial IA:", error);
                setIaReports([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadProjectHistory();
    }, [obraId]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-[650px]">
            <p className="text-xl font-medium text-primary">Cargando reportes de IA...</p>
        </div>
    }


    return (
        <div>
            <h3 className="flex items-center gap-2 text-secondary-plus font-bold text-xl mt-6"><Flower size={20} /> HISTORIAL DE REPORTES IA</h3>
            <section>
                <h4>{iaReports.resultado.proyecto.codigo}</h4>
                <h4>{iaReports.resultado.proyecto.codigo}</h4>
                <h4>{iaReports.resultado.proyecto.codigo}</h4>

            </section>
        </div>
    )
}

export default ReporteIAObraHistorial
