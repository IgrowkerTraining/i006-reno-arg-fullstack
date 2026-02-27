import { Check, Hammer } from 'lucide-react';
import React, {useMemo} from 'react'
import { Card } from '../common/Card';
import { PLANNING_GROUPS, SYSTEM_OPTIONS } from './constants';



interface RenderPlanificacionStepProps {
  formData: {
    systemType: string;
  };
  selectedTasks: Record<string, string[]>;
  setSelectedTasks: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

const RenderPlanificacionStep = ({ formData, selectedTasks, setSelectedTasks }: RenderPlanificacionStepProps) => {

  const selectedSystem = useMemo(
    () => SYSTEM_OPTIONS.find((option) => option.id === formData.systemType),
    [formData.systemType],
  );

    const toggleTask = (groupId: string, task: string) => {
      setSelectedTasks((previous) => {
        const currentList = previous[groupId] ?? [];
        const updatedList = currentList.includes(task)
          ? currentList.filter((item) => item !== task)
          : [...currentList, task];
  
        return {
          ...previous,
          [groupId]: updatedList,
        };
      });
    };
  

  return (
   <section className="space-y-5">
      <div className="rounded-sm border-l-2 border-secondary pl-3">
        <h2 className="text-lg font-semibold text-neutro-1">Sistema Constructivo</h2>
        <p className="text-sm text-slate-500">
          Selecciona el metodo predominante de la intervencion.
        </p>
      </div>

      <div className="rounded-md border border-[#BAC1D8] bg-[#EEF0F7] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-primary">{selectedSystem?.title}</h3>
            <p className="text-base text-neutro-1">{selectedSystem?.description}</p>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary text-primary">
            <Check size={18} />
          </span>
        </div>
      </div>

      <Card className="border-[#CAD3EC] bg-[#FBFCFF] p-0">
        <div className="rounded-t-xl bg-primary/8 px-4 py-3">
          <h3 className="flex items-center gap-2 text-xl font-semibold uppercase text-primary">
            <Hammer size={16} />
            Planificacion de etapas
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Tilda las tareas que formaran parte de esta obra.
          </p>
        </div>

        <div className="max-h-64 space-y-4 overflow-y-auto p-4 pr-3">
          {PLANNING_GROUPS.map((group) => (
            <div key={group.id} className="rounded-md border border-[#DBE0EF] bg-white">
              <h4 className="rounded-t-md bg-[#DFE5F8] px-3 py-2 text-lg font-semibold uppercase text-primary">
                {group.title}
              </h4>
              <div className="space-y-2 px-3 py-3">
                {group.tasks.map((task) => {
                  const checked = (selectedTasks[group.id] ?? []).includes(task);

                  return (
                    <label key={task} className="flex items-center gap-2 text-base text-neutro-1">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTask(group.id, task)}
                        className="h-4 w-4 rounded border-slate-300 accent-primary"
                      />
                      {task}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}

export default RenderPlanificacionStep
