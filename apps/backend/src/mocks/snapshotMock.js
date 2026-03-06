    export const snapshotMock = {
                project: {
                    codigo: 'RENO-AR-2026-014',
                    nombre: 'Reforma vivienda unifamiliar – Barrio Caballito',
                    responsable_tecnico: 'Arq. Natasha Marco'
                },
                periodo: {
                    desde: '2026-04-01',
                    hasta: '2026-04-30'
                },
                etapas: {
                    nombre: 'Obra gruesa',
                    estado: 'EN_CURSO',
                    avance_estimado: 45
                },
                registros_avance: {
                    fecha: '2026-04-18',
                    supervisor: 'Martín González',
                    tareas_ejecutadas: [
                    'Levantamiento de tabique',
                    'Canalización eléctrica'
                    ],
                    oficios_activos: [
                    'Albañilería',
                    'Electricidad'
                    ],
                    porcentaje_avance: 45
                },
                medidas_seguridad: {
                    fecha: '2026-04-18',
                    implementadas: [
                    'Uso obligatorio de casco',
                    'Señalización de zonas de trabajo',
                    'Protección de aberturas'
                    ],
                    cobertura_art: {
                    entidad: 'Provincia ART',
                    vigencia: 'Activa'
                    }
                },
                validaciones_tecnicas: {
                    fecha: '2026-04-18',
                    estado: 'EN_CURSO',
                    etapa: 'Obra gruesa',
                    responsable: 'Arq. Natasha Marco'
                }
                };

    export default snapshotMock;