import React from 'react'


const DropdownFilter = ({ setSelectedMonth, setSelectedYear }) => {
    return (
        <div className="absolute right-0 top-12 bg-white shadow-lg rounded-lg p-4 w-64 z-50 text-primary">
            <div className="flex flex-col gap-3">

                <select className="w-full border border-primary/40 bg-white rounded-lg px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-primary/40 focus:border-primary hover:border-primary"
                    onChange={(e) =>
                        setSelectedMonth(
                            e.target.value === "" ? null : Number(e.target.value)
                        )
                    }
                >
                <option value="">Todos los meses</option>
                <option value="0">Enero</option>
                <option value="1">Febrero</option>
                <option value="2">Marzo</option>
                <option value="3">Abril</option>
                <option value="4">Mayo</option>
                <option value="5">Junio</option>
                <option value="6">Julio</option>
                <option value="7">Agosto</option>
                <option value="8">Septiembre</option>
                <option value="9">Octubre</option>
                <option value="10">Noviembre</option>
                <option value="11">Diciembre</option>
            </select>

            <select
                className="w-full border border-primary/40 bg-white rounded-lg px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-1 focus:ring-primary/40 focus:border-primary hover:border-primary"
                onChange={(e) =>
                    setSelectedYear(
                        e.target.value === "" ? null : Number(e.target.value)
                    )
                }
            >
                <option className="bg-white text-primary" value="">Todos los años</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
            </select>
        </div>
               </div >
  )
}

export default DropdownFilter
