
INSERT INTO ROL (nombre) VALUES ('Arquitecto'), ('Supervisor');

INSERT INTO ESTADO (nombre) VALUES 
('Pendiente'), ('En Curso'), ('Finalizado'), ('Detenido');

INSERT INTO TIPO_ETAPA (nombre) VALUES 
('Demolición y retiro'), --1
('Obra gruesa'), --2
('Instalaciones'), --3
('Revoque y superficies'), --4
('Terminaciones y montaje'); --5

INSERT INTO OFICIO (nombre) VALUES 
('Albañilería'), ('Plomería'), ('Electricidad'), ('Pintura'), ('Carpintería');

INSERT INTO MEDIDAS_SEGURIDAD (descripcion) VALUES 
('Uso de Casco Obligatorio'), ('Uso de Arnés de Seguridad'), ('Uso de Gafas Protectoras'), ('Delimitación de Zona de Trabajo');


INSERT INTO SISTEMA_CONSTRUCTIVO (nombre) VALUES 
('Tradicional'), ('Seco'), ('Mixto');

INSERT INTO USUARIO (nombre, apellido, email, contrasena, id_rol) VALUES 
('Juan', 'Perez', 'juan@reno.com', 'admin123', 1),
('Pepe', 'Perez', 'pepe@reno.com', '123456', 2);

INSERT INTO CAT_ART (nombre_entidad_ART) VALUES ('Prevención ART'), ('Galeno ART'), ('Swiss Medical');

INSERT INTO COBERTURA_ART (nombre_entidad_ART, valida_desde, valida_hasta, estado_ART) VALUES 
('Federación Patronal', '2025-01-01', '2025-12-31', TRUE);

INSERT INTO PROYECTO (codigo, nombre, ubicacion, superficie_m2, id_responsable, id_sistema_constructivo, id_ART, matricula_responsable) VALUES 
('P-001', 'Renovación Casa Centro', 'Av. Cabildo 2450, Belgrano, CABA', 85, 1, 1, null, 'MAT-001'),
('P-002', 'Local Comercial', 'Av. Corrientes 3200, Almagro, CABA', 45, 1, 2, 1, 'MAT-002');


INSERT INTO ETAPA (id_proyecto, id_tipo_etapa, fecha_inicio, fecha_fin, id_estado) 
VALUES 
(1, 3, '2026-03-01', NULL, 1),
(1, 4, '2026-03-16', NULL, 1);


INSERT INTO TIPO_TAREA (id_tipo_etapa, nombre) VALUES 
(1, 'Picado de pared'), 
(1, 'Retiro de aberturas'),
(1, 'Levantamiento de piso'),
(2, 'Levantamiento de tabique'), 
(2, 'Contrapiso'),
(2, 'Carpetas'),
(2, 'Refuerzo estructural'),
(3, 'Electrica'),
(3, 'Sanitaria'),
(3, 'Gas'),
(4, 'Revoque grueso'),
(4, 'Revoque fino'),
(4, 'Enlucido de yeso'),
(4, 'Colocacion de pisos'),
(5, 'Colocacion de azulejos'),
(5, 'Colocacion de mesadas'),
(5, 'Colocacion de mueble cocina'),
(5, 'Colocacion de pintura');


INSERT INTO TAREA (id_etapa, id_tipo_tarea, id_estado) VALUES 
(1, 8, 1),
(1, 10, 1),
(2, 12, 1),
(2, 13, 1);
