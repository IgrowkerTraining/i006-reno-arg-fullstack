import { Building2, Eye, Flower, House, SlidersHorizontal } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounced";
import { Search } from "../components/common/Search";
import DropdownFilter from "../components/home/DropdownFilter";
import { Card } from "../components/common/Card";
import { Button } from "../components/common/Button";
import { useAuthApi } from "../hooks/useAuthApi";
import { formatDate } from "../utils/formateDate";
import Modal from "../components/common/Modal";
import CardGenerateAI from "../components/common/CardGenerateAI";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]



const ReporteIA: React.FC = () => {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const today = new Date()
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth())
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear())
  const monthName = months[selectedMonth]
  const { getProjects } = useAuthApi();
  const [projects, setProjects] = React.useState<any[]>([]);

  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 300)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any | null>(null)
  const [selectedProjectID, setSelectedProjectID] = useState<number | null>(null)

  const [projectReportsMap, setProjectReportsMap] = useState<Record<number, boolean>>({})

  const handleOpenModal = (project) => {
    setSelectedProject(project)
    setSelectedProjectID(project.id)
    setIsModalOpen(true)
  }

  const handleHistory = (id) => {
    navigate(`/dashboard/reporte-ia/${id}/historial`);
  }

  useEffect(() => {
    const fetchObras = async () => {
      try {
        setIsLoading(true)
        const data = await getProjects();
        setProjects(data);
        setIsLoading(false)
      } catch (error) {
        console.error("Error al cargar proyectos:", error);
      }
    };
    fetchObras();
  }, [getProjects]);

  useEffect(() => {
    const checkReports = async () => {
      const results: Record<number, boolean> = {}
      await Promise.all(
        projects.map(async (project) => {
          try {
            const response = await api.getIAReportsByProjectId(project.id);
            results[project.id] = response.data.length > 0
          } catch {
            results[project.id] = false
          }
        })
      )
      setProjectReportsMap(results)
    }
    if (projects.length > 0) {
      checkReports()
    }
  }, [projects])

  const filteredProjects = projects.filter((project) => {
    const search = debouncedSearch.toLowerCase()
    const searchMatch =
      !search ||
      project.name?.toLowerCase().includes(search) ||
      project.code?.toLowerCase().includes(search) ||
      project.location?.toLowerCase().includes(search)

    const date = new Date(project.registrationDate + "T00:00:00")

    const monthMatch = selectedMonth === null ? true : date.getMonth() === selectedMonth
    const yearMatch = selectedYear === null ? true : date.getFullYear() === selectedYear

    return searchMatch && monthMatch && yearMatch
  })

  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  if (isLoading) {
    return <div className="flex items-center justify-center h-[650px]">
      <p className="text-xl font-medium text-primary">Cargando datos...</p>
    </div>
  }


  return (
    <div >
      <div className="w-full grid md:grid-cols-3 items-start justify-between gap-2 mt-4">
        <h3 className="col-span-1 md:col-span-2 flex items-center gap-2 text-secondary-plus font-bold text-2xl"><Flower size={20} /> REPORTE IA</h3>
        <Search
          placeholder="Buscar obra..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full col-span-1" />
      </div>
      <h2 className="text-3xl mt-4 md:mt-0 ">Análisis asistido por proyecto</h2>
      <div className="flex items-center justify-between">
        <div className="mt-6">
          <h4 className="text-xl text-primary font-bold">Proyectos recientes</h4>
          <h5>Período: {monthName} {selectedYear} | ({filteredProjects.length} proyectos)</h5>
        </div>
        <div ref={filterRef} className="relative">
          <SlidersHorizontal className="text-primary cursor-pointer" onClick={() => setIsFilterOpen((prev) => !prev)} />
          {isFilterOpen && (
            <DropdownFilter setSelectedMonth={setSelectedMonth} setSelectedYear={setSelectedYear} />
          )}
        </div>
      </div>

      <section className="mt-6 flex flex-col gap-2">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (

            <Card key={project.id} className="rounded-xl w-full border-neutro-3 flex flex-col md:flex-row items-center justify-between bg-white px-6 py-4 gap-4">
              <div >

                <div className="flex items-center gap-4">
                  <Building2 className="inline text-secondary w-6 h-6" />
                  <div >
                    <span className="text-xs font-medium">
                      {project.code}
                    </span>
                    <h3 className="text-lg font-semibold" >{project.name}</h3>
                    <p className="text-md flex items-center">{project.location}</p>
                    <p className="text-xs flex items-center">Fecha inicio de obra: {formatDate(project.registrationDate)}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3 text-sm">
                {projectReportsMap[project.id] && (
                  <Button
                    variant="accent"
                    onClick={() => handleHistory(project.id)}
                  >
                    <Eye className="inline w-4 h-4 mr-2" />
                    REPORTES IA GENERADOS
                  </Button>
                )}
                <Button variant="secondary" onClick={() => handleOpenModal(project)} className=""><Flower className="inline w-4 h-4 mr-2" />GENERAR ANÁLISIS IA</Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No hay proyectos para este período.</p>
        )}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Análisis IA"
        >
          {selectedProject && (
            <>
              <p className="font-semibold">{selectedProject.name}</p>
              <p className="text-sm text-gray-500">{selectedProject.location}</p>

              <CardGenerateAI id={selectedProject.id} />
            </>
          )}
        </Modal>

      </section>
    </div>
  );
};

export default ReporteIA;

