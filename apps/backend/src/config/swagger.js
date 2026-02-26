const path = require('path');
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        // ... info, servers
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: {
                            type: 'string',
                            format: 'email',
                            example: 'test1@test.com',
                        },
                        password: {
                            type: 'string',
                            format: 'password',
                            example: 'password123',
                        },
                    },
                },
                LoginResponse: {
                    type: 'object',
                    properties: {
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', example: 3 },
                                name: { type: 'string', example: 'Natasha' },
                                lastName: { type: 'string', example: 'Marco' },
                                email: { type: 'string', example: 'test1@test.com' },
                                idRol: { type: 'integer', example: 1 },
                            },
                        },
                        token: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                        },
                        message: {
                            type: 'string',
                            example: 'Login successful',
                        },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'Credenciales inválidas o usuario no encontrado',
                        },
                        status: {
                            type: 'integer',
                            example: 401,
                        },
                    },
                },
                Proyecto: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 6 },
                        code: { type: 'string', example: 'RENO-ARG-2026-6' },
                        name: { type: 'string', example: 'Reforma local comercial' },
                        location: { type: 'string', example: 'Barrio Nuñez' },
                        surfaceM2: { type: 'integer', example: 20 },
                        registrationDate: {
                            type: 'string',
                            format: 'date-time',
                            example: '2026-02-21T03:00:00.000Z',
                        },
                        manager: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', example: 3 },
                                name: { type: 'string', example: 'Natasha' },
                                license: { type: 'string', example: 'MAT-5522' },
                            },
                        },
                        config: {
                            type: 'object',
                            properties: {
                                constructionSystemId: { type: 'integer', example: 3 },
                                artCoverageId: { type: 'integer', nullable: true, example: null },
                            },
                        },
                    },
                },
                Tarea: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 5 },
                        stageId: { type: 'integer', example: 3 },
                        typeTaskId: { type: 'integer', example: 1 },
                        statusId: { type: 'integer', example: 1 },
                        typeName: { type: 'string', example: 'Picado de pared' },
                        statusName: { type: 'string', example: 'Pendiente' },
                    },
                },
                Etapa: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 3 },
                        projectId: { type: 'integer', example: 3 },
                        typeStageId: { type: 'integer', example: 1 },
                        startDate: {
                            type: 'string',
                            format: 'date-time',
                            example: '2026-03-15T03:00:00.000Z',
                        },
                        endDate: { type: 'string', nullable: true, example: null },
                        statusId: { type: 'integer', example: 1 },
                        typeName: { type: 'string', example: 'Demolición y retiro' },
                        statusName: { type: 'string', example: 'Pendiente' },
                        tasks: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Tarea' },
                        },
                    },
                },
                ProyectoDetalle: {
                    allOf: [
                        { $ref: '#/components/schemas/Proyecto' },
                        {
                            type: 'object',
                            properties: {
                                stages: {
                                    type: 'array',
                                    items: { $ref: '#/components/schemas/Etapa' },
                                },
                            },
                        },
                    ],
                },
                ProjectCreateInput: {
                    type: 'object',
                    required: [
                        'nombre',
                        'ubicacion',
                        'superficie_m2',
                        'id_responsable',
                        'id_sistema_constructivo',
                        'matricula_responsable',
                    ],
                    properties: {
                        nombre: { type: 'string', example: 'Reforma Oficinas Centrales' },
                        ubicacion: { type: 'string', example: 'Nuñez, Buenos Aires' },
                        superficie_m2: { type: 'number', example: 150.5 },
                        id_responsable: { type: 'integer', example: 3 },
                        id_sistema_constructivo: { type: 'integer', example: 1 },
                        id_art: { type: 'integer', nullable: true, example: null },
                        matricula_responsable: { type: 'string', example: 'MAT-9988' },
                        etapas: {
                            type: 'array',
                            items: {
                                type: 'object',
                                required: ['id_tipo_etapa', 'fecha_inicio'],
                                properties: {
                                    id_tipo_etapa: { type: 'integer', example: 1 },
                                    fecha_inicio: { type: 'string', format: 'date', example: '2026-04-01' },
                                    tareas: {
                                        type: 'array',
                                        description: 'Lista de IDs de tipos de tareas',
                                        items: { type: 'integer' },
                                        example: [1, 2, 3],
                                    },
                                },
                            },
                        },
                    },
                },
                ReportSummary: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 3 },
                        date: { type: 'string', format: 'date-time', example: '2026-02-23T03:00:00.000Z' },
                        project_name: { type: 'string', example: 'Reforma vivienda' },
                        supervisor: { type: 'string', example: 'Juan' },
                        progress_percentage: { type: 'string', example: '20.00' },
                        comment: { type: 'string', example: 'Reporte de prueba' },
                        validation_status: { type: 'string', example: 'PENDIENTE' },
                    },
                },
                ReportDetail: {
                    type: 'object',
                    properties: {
                        reportid: { type: 'integer', example: 3 },
                        supervisorid: { type: 'integer', example: 1 },
                        projectid: { type: 'integer', example: 3 },
                        date: { type: 'string', example: '2026-02-23T03:00:00.000Z' },
                        progresspercentage: { type: 'string', example: '20.00' },
                        comment: { type: 'string', example: 'Reporte de prueba' },
                        projectname: { type: 'string', example: 'Reforma vivienda' },
                        supervisorname: { type: 'string', example: 'Juan' },
                        validationstatus: { type: 'string', example: 'PENDIENTE' },
                        technicalcomment: { type: 'string', nullable: true, example: null },
                        tasks: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    task_name: { type: 'string', example: 'Contrapiso' },
                                    task_status: { type: 'string', example: 'En Curso' },
                                },
                            },
                        },
                        trades: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    trade_name: { type: 'string', example: 'Albañilería' },
                                },
                            },
                        },
                        safety: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    safety_description: { type: 'string', example: 'Uso de Casco Obligatorio' },
                                    status: { type: 'boolean', example: true },
                                },
                            },
                        },
                    },
                },
                ReportCreateInput: {
                    type: 'object',
                    required: [
                        'idProject',
                        'idSupervisor',
                        'progressPercentage',
                        'selectedTasks',
                        'selectedTrades',
                        'safetyItems',
                    ],
                    properties: {
                        idProject: { type: 'integer', example: 3 },
                        idSupervisor: { type: 'integer', example: 1 },
                        progressPercentage: { type: 'number', example: 25.5 },
                        comment: { type: 'string', example: 'Avance según lo previsto en la etapa de cimientos.' },
                        selectedTasks: {
                            type: 'array',
                            description: 'Lista de IDs de las tareas que se trabajaron',
                            items: { type: 'integer' },
                            example: [10, 11, 15],
                        },
                        selectedTrades: {
                            type: 'array',
                            description: 'Lista de IDs de los oficios presentes (Albañilería, Plomería, etc.)',
                            items: { type: 'integer' },
                            example: [1, 4],
                        },
                        safetyItems: {
                            type: 'array',
                            description: 'Lista de objetos con ID de medida de seguridad y su estado',
                            items: {
                                type: 'object',
                                properties: {
                                    id_safety: { type: 'integer', example: 5 },
                                    status: { type: 'boolean', example: true },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;