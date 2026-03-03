export interface ReportDraft {
  selectedTasks: number[];
  selectedTrades: number[];
  safetyItems: Array<{ id: number; status: boolean }>;
}

const createDefaultDraft = (): ReportDraft => ({
  selectedTasks: [],
  selectedTrades: [],
  safetyItems: [],
});

const getDraftKey = (projectId: string) => `report_draft_${projectId}`;

export const getReportDraft = (projectId: string): ReportDraft => {
  const raw = localStorage.getItem(getDraftKey(projectId));
  if (!raw) return createDefaultDraft();

  try {
    const parsed = JSON.parse(raw) as Partial<ReportDraft>;
    return {
      selectedTasks: parsed.selectedTasks ?? [],
      selectedTrades: parsed.selectedTrades ?? [],
      safetyItems: parsed.safetyItems ?? [],
    };
  } catch {
    return createDefaultDraft();
  }
};

export const saveReportDraft = (projectId: string, draft: Partial<ReportDraft>) => {
  const current = getReportDraft(projectId);
  const nextDraft: ReportDraft = {
    selectedTasks: draft.selectedTasks ?? current.selectedTasks,
    selectedTrades: draft.selectedTrades ?? current.selectedTrades,
    safetyItems: draft.safetyItems ?? current.safetyItems,
  };

  localStorage.setItem(getDraftKey(projectId), JSON.stringify(nextDraft));
  return nextDraft;
};

export const clearReportDraft = (projectId: string) => {
  localStorage.removeItem(getDraftKey(projectId));
};
