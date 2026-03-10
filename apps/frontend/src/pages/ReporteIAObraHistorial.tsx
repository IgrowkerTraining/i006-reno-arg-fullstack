import { ArrowRightCircle, Flower } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api';
import { Card } from '../components/common/Card';

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
                {iaReports && (
                    <>
                        {/*  <h4>{iaReports?.resultado?.proyecto.codigo}</h4>
                        <h3>{iaReports?.resultado.proyecto.codigo}</h3>
                        <h4>{iaReports?.resultado.proyecto.codigo}</h4> */}


                    </>
                )}

                <Card className="flex flex-col gap-4 p-8 rounded-xl border-neutro-3 bg-white">
                    <div className="bg-white rounded-xl border border-gray-200 p-4">

                        <div className="grid grid-cols-[140px_140px_3fr_40px] text-sm font-semibold text-gray-600 border-b pb-2">
                            <div>Fecha generación</div>
                            <div>Período analizado</div>
                            <div>Resumen general de análisis</div>
                          
                            <div></div>
                        </div>
                     
{/* 
                        {iaReports.map((report) => (
                            <div
                                key={report.id}
                                className="grid grid-cols-[140px_140px_1fr_1fr_1fr_40px] items-center text-sm py-3 border-b border-neutro-3 last:border-none"
                            >
                                <div>{report.fecha_generacion}</div>
                                <div>{report.periodo}</div>
                                <div>{report.proyecto.nombre}</div>
                                <div>{report.proyecto.codigo}</div>

                                <div className="truncate">
                                    {report.resumen}
                                </div>
                                <ArrowRightCircle className="text-secondary"/>
                            </div>
                        ))} */}

                    </div>

                </Card>
            </section>
        </div>
    )
}

export default ReporteIAObraHistorial
