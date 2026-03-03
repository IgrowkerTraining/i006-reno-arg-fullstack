
const e = require('express');
const Project = require('../models/Project');
const Report = require('../models/Report');
const Validation = require('../models/Validation');

class DashboardService {
    static async getStats() {
        
        const [projectsCount, reportsCount, pendingCount, artData] = await Promise.all([
            Project.countAll(),
            Report.countAll(),
            Validation.countByStatus('PENDIENTE'),
            Project.countArtActive()
        ]);
        const artPercentage = artData.total > 0 
            ? Math.round((artData.with_art / artData.total) * 100) 
            : 0;

        return {
            activeProjects: projectsCount,
            totalReports: reportsCount,
            pendingTasks: pendingCount,
            artVigente: `${artPercentage}%`,
            validatedProjects: 0 
        };
    }
}

exports = module.exports = DashboardService;