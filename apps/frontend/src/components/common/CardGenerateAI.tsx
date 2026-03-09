import React from 'react'
import { Card } from './Card'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { api } from '@/src/services/api';
import { Input } from './Input';
import { Button } from './Button';
import { Flower } from 'lucide-react';


type CardGenerateAIProps = {
    id: number
}

const CardGenerateAI: React.FC<CardGenerateAIProps> = ({ id }) => {

    const navigate = useNavigate();

    const [loadingAnalysis, setLoadingAnalysis] = useState(false);

    const [month, setMonth] = useState("");
    const [year, setYear] = useState("")

    const handleGenerateAnalysis = async () => {

        if (!id || !month || !year) return;
        try {
            setLoadingAnalysis(true);
            const response = await api.generateAnalysis(
                id,
                Number(month),
                Number(year)
            );

            navigate(`/dashboard/reporte-ia/${id}`, {
                state: {
                    analysis: response,
                    month,
                    year,
                },
            });
        } catch (error: any) {
            console.error("Error generando análisis", error)

            if (error.message?.includes("Data not found")) {
                alert("No hay registros para ese proyecto en el período seleccionado.")
            } else {
                alert("Ocurrió un error al generar el análisis.")
            }
        } finally {
            setLoadingAnalysis(false);
        }
    };

    console.log("ID:", id)
    console.log("Month:", month)
    console.log("Year:", year)

    return (
        <Card className="p-6 mx-4 my-6 rounded-lg bg-neutro-3/60 border-neutro-3">
            {loadingAnalysis ? (
                <p className="text-md text-neutro-1 animate-pulse">
                    Generando análisis con IA, esto puede tardar unos segundos...
                </p>
            ) :
                (
                    <><p className="pb-2">Período a analizar:</p>
                        <div className="flex gap-2 mb-4">
                            {/*  <Input
                                type="number"
                                placeholder="Mes"
                                min="1"
                                max="12"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="rounded-md border-neutro-2 bg-white text-base placeholder:text-slate-400"
                            /> */}
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
                                className="rounded-md border-neutro-2 bg-white text-base placeholder:text-slate-400"
                            />
                        </div>
                        <Button
                            variant="secondary"
                            className=" mb-4 w-full"
                            onClick={handleGenerateAnalysis}
                        >
                            <Flower className="inline mr-2" />
                            GENERAR ANALISIS IA
                        </Button>
                    </>)}
        </Card>
    )
}

export default CardGenerateAI
