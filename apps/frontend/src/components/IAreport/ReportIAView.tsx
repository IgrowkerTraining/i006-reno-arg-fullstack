import React, { useRef } from "react"
import { Download, Eye, FileText, Flower, HardHat, LayoutPanelTop, UserRoundCog } from "lucide-react"
import { Button } from "../common/Button"
import { handleExportPDF } from "@/src/utils/exportReport"
import { Card } from "../common/Card"
import { formatDate } from "@/src/utils/formateDate"

type ReportIAViewProps = {
    dataAnalysis: any
    month?: string
    year?: string
}

const ReportIAView: React.FC<ReportIAViewProps> = ({ dataAnalysis, month, year }) => {

    const reportRef = useRef<HTMLDivElement>(null);

    if (!dataAnalysis) {
        return <p>No hay análisis disponible</p>
    }

    
/*     const normalizedData = {
        proyecto: dataAnalysis.Proyecto?.Nombre ?? dataAnalysis.resultado.proyecto.nombre,

        periodoAnalizado:
            dataAnalysis.content.resultado["Período analizado"] ??
            dataAnalysis.resultado.periodo_analizado,

        fechaGeneracion:
            dataAnalysis.createdAt,

        resumen:
            dataAnalysis.content.resultado["Resumen general del estado de la obra"] ??
            dataAnalysis.resultado.resumen_general_del_estado_de_la_obra,

        ejecucion:
            dataAnalysis.content.resultado["Ejecución y planificación"] ??
            dataAnalysis.resultado.ejecucion_y_planificacion,

        seguridad:
            dataAnalysis.content.resultado["Medidas de seguridad y cumplimiento"] ??
            dataAnalysis.resultado.medidas_de_seguridad_y_cumplimiento,

        validaciones:
            dataAnalysis.content.resultado["Validaciones técnicas"] ??
            dataAnalysis.resultado.validaciones_tecnicas,

        observacion:
            dataAnalysis.content.resultado["Observación general"] ??
            dataAnalysis.resultado.observacion_general,
    };
 */

    const result =
  dataAnalysis?.content?.resultado ??
  dataAnalysis?.resultado ??
  dataAnalysis?.analysis?.resultado;

const normalizedData = {
  proyecto:
    result?.Proyecto?.Nombre ??
    result?.proyecto?.nombre,

  periodoAnalizado:
    result?.["Período analizado"] ??
    result?.periodo_analizado,

  fechaGeneracion:
    dataAnalysis?.createdAt ??
    result?.["Fecha de generación"] ??
    result?.fecha_de_generacion,

  resumen:
    result?.["Resumen general del estado de la obra"] ??
    result?.resumen_general_del_estado_de_la_obra,

  ejecucion:
    result?.["Ejecución y planificación"] ??
    result?.ejecucion_y_planificacion,

  seguridad:
    result?.["Medidas de seguridad y cumplimiento"] ??
    result?.medidas_de_seguridad_y_cumplimiento,

  validaciones:
    result?.["Validaciones técnicas"] ??
    result?.validaciones_tecnicas,

  observacion:
    result?.["Observación general"] ??
    result?.observacion_general,
};
    return (
        <div ref={reportRef}>
            <h3 className="flex items-center gap-2 text-secondary-plus font-bold text-2xl">
                <Flower size={20} /> ANÁLISIS ASISTIDO POR IA
            </h3>

            <header className="flex items-end gap-6 mt-4">
                <div>
                    <h2 className="font-bold text-2xl my-2">
                        {normalizedData.proyecto}
                    </h2>

                    <h4 className="font-semibold">
                        Periodo analizado: {normalizedData.periodoAnalizado} | Fecha de generación: {formatDate(normalizedData.fechaGeneracion)}
                    </h4>
                </div>

                <Button
                    variant="outline"
                    className="ml-auto"
                    onClick={() => handleExportPDF({ reportRef, dataAnalysis })}
                    data-html2canvas-ignore="true"
                >
                    <Download size={20} className="mr-2" />
                    Exportar PDF
                </Button>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 ">
                <Card className="flex flex-col gap-4 p-8 rounded-xl border-neutro-3 bg-white" >
                    <h4 className="font-bold text-xl"><FileText size={25} className="inline mr-2 text-secondary" />Resumen General</h4>
                    <div className="border-l-4 border-secondary pl-4">
                        <p>{normalizedData.resumen}</p>
                    </div>

                </Card>
                <Card className="flex flex-col gap-4 p-8 rounded-xl border-neutro-3 bg-white" >
                    <h4 className="font-bold text-xl"><LayoutPanelTop size={25} className="inline mr-2 text-accent" />Ejecución y Planificación</h4>
                    <div className="border-l-4 border-accent pl-4">
                        <p >{normalizedData.ejecucion}</p>
                    </div>

                </Card>
                <Card className="flex flex-col gap-4 p-8 rounded-xl border-neutro-3 bg-white" >
                    <h4 className="font-bold text-xl"><HardHat size={25} className="inline mr-2 text-primary" />Medidas de seguridad y cumplimiento</h4>
                    <div className="border-l-4 border-primary pl-4">
                        <p>{normalizedData.seguridad}</p>
                    </div>


                </Card>
                <Card className="flex flex-col gap-4 p-8 rounded-xl border-neutro-3 bg-white" >
                    <h4 className="font-bold text-xl"><UserRoundCog size={25} className="inline mr-2 text-accent-2" />Validación técnica</h4>
                    <div className="border-l-4 border-accent-2 pl-4">
                        <p>{normalizedData.validaciones}</p>
                    </div>

                </Card>
                <Card className="flex flex-col gap-4 p-8 rounded-xl bg-[#E5EAFA] border-[#5373DE] col-span-2 text-[#5373DE]" >
                    <h4 className="font-bold text-xl"><Eye size={25} className="inline mr-2 " />Observación General</h4>
                    <p>{normalizedData.observacion}</p>
                </Card>
            </section>
        </div>
    )
}

export default ReportIAView