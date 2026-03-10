import { ArrowRightCircle, Flower } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../services/api';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { formatDate } from '../utils/formateDate';

const ReporteIAObraHistorial: React.FC = () => {

    const { obraId } = useParams<string>();
    const [isLoading, setIsLoading] = useState(false)
    const [iaReports, setIaReports] = useState<any[]>([])

    const proyecto = iaReports?.[0]?.content?.resultado?.Proyecto;

    const [month, setMonth] = useState("");
    const [year, setYear] = useState("")

    const navigate = useNavigate()

    useEffect(() => {

        if (!obraId) return;

        const loadProjectHistory = async () => {
            try {
                setIsLoading(true);
                const IAReportHistory = await api.getIAReportsByProjectId(obraId);

                console.log("IAReportHistory.data", IAReportHistory.data);
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
            <p className="text-xl font-medium text-primary">Cargando historial de reportes de IA...</p>
        </div>
    }

    const filteredReports = iaReports.filter((report) => {
        const resultado = report.content?.resultado;

        if (!resultado) return false;

        const periodo = resultado["Período analizado"];

        if (!periodo) return true;

        const [reportMonth, reportYear] = periodo.split("/");

        const monthMatch = month ? Number(reportMonth) === Number(month) : true;
        const yearMatch = year ? Number(reportYear) === Number(year) : true;

        return monthMatch && yearMatch;
    });



    return (
        <div>
            <h3 className="flex items-center gap-2 text-secondary-plus font-bold text-xl mt-6"><Flower size={20} /> HISTORIAL DE REPORTES IA</h3>
            <section className="mt-6 ">
                {proyecto && (
                    <>
                        <h4 className="">{proyecto.Codigo}</h4>
                        <h3 className="text-2xl text-primary font-bold">{proyecto.Nombre}</h3>
                        <h4 className="text-sm font-bold">{proyecto.Direccion}</h4>
                    </>
                )}
                <div className="w-60 mt-6">
                    <p className="pb-2">Período a analizar:</p>
                    <div className="flex gap-2 mb-4">
                        <select
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="rounded-md border-neutro-2 bg-white text-base text-neutro-1 placeholder:text-slate-600
                focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary
                transition-all duration-200"
                        >
                            <option value="">Mes</option>
                            <option value="1">Enero</option>
                            <option value="2">Febrero</option>
                            <option value="3">Marzo</option>
                            <option value="4">Abril</option>
                            <option value="5">Mayo</option>
                            <option value="6">Junio</option>
                            <option value="7">Julio</option>
                            <option value="8">Agosto</option>
                            <option value="9">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                        <Input
                            type="number"
                            placeholder="Año"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="rounded-md border-neutro-2 bg-white text-base placeholder:text-slate-400 w-[100px]"
                        />
                    </div>
                </div>


                <Card className="flex flex-col gap-4 p-8 rounded-xl border-neutro-3 bg-white mt-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-4">

                        <div className="grid grid-cols-[140px_140px_3fr_40px] text-sm font-semibold text-gray-600 border-b pb-2">
                            <div>Fecha generación</div>
                            <div>Período analizado</div>
                            <div>Resumen general de análisis</div>

                            <div></div>
                        </div>


                        {filteredReports.map((report) => {
                            const resultado = report.content?.resultado;
                            return (
                                <div
                                    key={report.id}
                                    className="grid grid-cols-[140px_140px_3fr_40px] items-center text-sm py-3 border-b border-neutro-3 last:border-none"
                                >
                                    <div>{formatDate(report.createdAt)}</div>
                                    <div>{resultado["Período analizado"]}</div>


                                    <div className="truncate pr-4">
                                        {resultado["Resumen general del estado de la obra"]}
                                    </div>
                                    <ArrowRightCircle
                                        className="text-secondary cursor-pointer"
                                        onClick={() =>
                                            navigate(`/dashboard/reporte-ia/${obraId}/historial/${report.id}`)
                                        }
                                    />
                                </div>)
                        })}
                        {filteredReports.length === 0 && (
                            <p className="text-gray-500 py-4">No hay reportes para el período seleccionado.</p>
                        )}

                    </div>

                </Card>
            </section>
        </div>
    )
}

export default ReporteIAObraHistorial
