
INSERT INTO ROL (nombre) VALUES ('Arquitecto'), ('Supervisor');

INSERT INTO ESTADO (nombre) VALUES 
('Pendiente'), ('En Curso'), ('Finalizado'), ('Detenido');

INSERT INTO OFICIO (nombre) VALUES 
('Albañilería'), ('Plomería'), ('Electricidad'), ('Pintura'), ('Carpintería');

INSERT INTO MEDIDAS_SEGURIDAD (descripcion) VALUES 
('Uso de Casco Obligatorio'), ('Uso de Arnés de Seguridad'), ('Uso de Gafas Protectoras'), ('Delimitación de Zona de Trabajo');

INSERT INTO INTERVENCION (nombre) VALUES 
('Obra Nueva'), ('Ampliación'), ('Refacción');

INSERT INTO SISTEMA_CONSTRUCTIVO (nombre) VALUES 
('Tradicional (Húmedo)'), ('Steel Framing'), ('Wood Framing');

INSERT INTO USUARIO (nombre, apellido, email, contrasena, id_rol) VALUES 
('Juan', 'Perez', 'juan@reno.com', 'admin123', 1),
('Pepe', 'Perez', 'pepe@reno.com', '123456', 2);


INSERT INTO COBERTURA_ART (nombre_entidad_ART, valida_desde, valida_hasta, estado_ART) VALUES 
('Federación Patronal', '2025-01-01', '2025-12-31', TRUE);

INSERT INTO PROYECTO (codigo, nombre, ubicacion, superficie_m2, id_responsable, id_sistema_constructivo, tipo_intervencion, id_ART) VALUES 
('P-001', 'Renovación Casa Centro', 'Av. Cabildo 2450, Belgrano, CABA', 85, 1, 1, 3, 1),
('P-002', 'Local Comercial', 'Av. Corrientes 3200, Almagro, CABA', 45, 1, 2, 1, 1);

INSERT INTO ETAPA (id_proyecto, nombre, fecha_inicio, fecha_fin, id_estado) VALUES
(1, 'Demolición y Retiro', '2024-03-01', '2024-03-10', 3), 
(1, 'Cimientos y Estructura', '2024-03-11', NULL, 2);