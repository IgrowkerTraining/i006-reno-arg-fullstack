
const e = require('express');
const Project = require('../models/Project');
const Report = require('../models/Report');
const Validation = require('../models/Validation');

class DashboardService {
    static async getStats() {
        
        const [projectsCount, reportsCount, pendingCount] = await Promise.all([
            Project.countAll(),
            Report.countAll(),
            Validation.countByStatus('PENDIENTE') 
        ]);

        return {
            activeProjects: projectsCount,
            totalReports: reportsCount,
            pendingTasks: pendingCount,
            artVigente: "100%",
            validatedProjects: 0 
        };
    }
}

exports = module.exports = DashboardService;