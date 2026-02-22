
CREATE TABLE ROL (
    id_rol SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);
CREATE TABLE TIPO_ETAPA (
    id_tipo_etapa SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE ESTADO (
    id_estado SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE   
);
CREATE TABLE OFICIO (
    id_oficio SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);
CREATE TABLE SISTEMA_CONSTRUCTIVO (
    id_sistema SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE MEDIDAS_SEGURIDAD (
    id_medidas_seg SERIAL PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE COBERTURA_ART (
    id_ART SERIAL PRIMARY KEY,
    nombre_entidad_ART VARCHAR(100) NOT NULL,
    valida_desde DATE,
    valida_hasta DATE,
    estado_ART BOOLEAN DEFAULT TRUE
);

CREATE TABLE USUARIO (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL, 
    id_rol INTEGER NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES ROL(id_rol)
);

CREATE TABLE PROYECTO (
    id_proyecto SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE,
    nombre VARCHAR(150) NOT NULL,
    ubicacion VARCHAR(255),
    superficie_m2 DECIMAL(10,2),
    fecha_registro DATE DEFAULT CURRENT_DATE,
    id_responsable INTEGER NOT NULL,
    id_sistema_constructivo INTEGER,
    id_ART INTEGER,
    matricula_responsable VARCHAR(50), 
    FOREIGN KEY (id_responsable) REFERENCES USUARIO(id_usuario),
    FOREIGN KEY (id_sistema_constructivo) REFERENCES SISTEMA_CONSTRUCTIVO(id_sistema),
    FOREIGN KEY (id_ART) REFERENCES COBERTURA_ART(id_ART)
);

CREATE TABLE ETAPA (
    id_etapa SERIAL PRIMARY KEY,
    id_proyecto INTEGER NOT NULL,
    id_tipo_etapa INTEGER NOT NULL,
    fecha_inicio DATE DEFAULT CURRENT_DATE,
    fecha_fin DATE,
    id_estado INTEGER NOT NULL,   
    FOREIGN KEY (id_proyecto) REFERENCES PROYECTO(id_proyecto) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo_etapa) REFERENCES TIPO_ETAPA(id_tipo_etapa),
    FOREIGN KEY (id_estado) REFERENCES ESTADO(id_estado)
);

CREATE TABLE ANALISIS_IA (
    id_analisis SERIAL PRIMARY KEY,
    id_proyecto INTEGER NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contenido_json JSONB,
    FOREIGN KEY (id_proyecto) REFERENCES PROYECTO(id_proyecto)
);

CREATE TABLE TIPO_TAREA (
    id_tipo_tarea SERIAL PRIMARY KEY,
    id_tipo_etapa INTEGER NOT NULL,
    nombre VARCHAR(100) NOT NULL,    
    FOREIGN KEY (id_tipo_etapa) REFERENCES TIPO_ETAPA(id_tipo_etapa)
);
CREATE TABLE TAREA (
    id_tarea SERIAL PRIMARY KEY,
    id_etapa INTEGER NOT NULL,      
    id_tipo_tarea INTEGER NOT NULL,  
    id_oficio INTEGER,               
    id_estado INTEGER DEFAULT 1,      
    FOREIGN KEY (id_etapa) REFERENCES ETAPA(id_etapa) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo_tarea) REFERENCES TIPO_TAREA(id_tipo_tarea),
    FOREIGN KEY (id_oficio) REFERENCES OFICIO(id_oficio),
    FOREIGN KEY (id_estado) REFERENCES ESTADO(id_estado)
);

CREATE TABLE REGISTRO_AVANCE (
    id_registro_avance SERIAL PRIMARY KEY,
    id_etapa INTEGER NOT NULL,
    id_supervisor INTEGER NOT NULL,
    fecha DATE DEFAULT CURRENT_DATE,
    avance_porcentaje DECIMAL(5,2),
    comentario TEXT,                
    FOREIGN KEY (id_etapa) REFERENCES ETAPA(id_etapa),
    FOREIGN KEY (id_supervisor) REFERENCES USUARIO(id_usuario)
);

CREATE TABLE DETALLE_AVANCE_TAREA (
    id_avance_tarea SERIAL PRIMARY KEY,
    id_registro_avance INTEGER NOT NULL,
    id_tarea INTEGER NOT NULL,
    id_estado_tarea INTEGER NOT NULL,
    observacion TEXT,
    FOREIGN KEY (id_registro_avance) REFERENCES REGISTRO_AVANCE(id_registro_avance),
    FOREIGN KEY (id_tarea) REFERENCES TAREA(id_tarea),
    FOREIGN KEY (id_estado_tarea) REFERENCES ESTADO(id_estado)
);

CREATE TABLE REGISTRO_SEGURIDAD (
    id_reg_seguridad SERIAL PRIMARY KEY,
    id_registro_avance INTEGER NOT NULL,
    etapa_seguridad INTEGER NOT NULL, 
    id_art INTEGER,
    cumple BOOLEAN DEFAULT FALSE,   
    FOREIGN KEY (id_registro_avance) REFERENCES REGISTRO_AVANCE(id_registro_avance),
    FOREIGN KEY (etapa_seguridad) REFERENCES etapa_seguridad(id_etapa_seg),
    FOREIGN KEY (id_art) REFERENCES COBERTURA_ART(id_ART)
);

CREATE TABLE VALIDACION_TECNICA (
    id_validacion SERIAL PRIMARY KEY,
    id_registro_avance INTEGER NOT NULL UNIQUE,
    id_responsable_tecnico INTEGER NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) CHECK (estado IN ('APROBADO', 'RECHAZADO', 'PENDIENTE')) DEFAULT 'PENDIENTE',
    comentario TEXT,
    FOREIGN KEY (id_registro_avance) REFERENCES REGISTRO_AVANCE(id_registro_avance),
    FOREIGN KEY (id_responsable_tecnico) REFERENCES USUARIO(id_usuario)
);
CREATE TABLE REGISTRO_SEGURIDAD (
    id_reg_seguridad SERIAL PRIMARY KEY,
    id_registro_avance INTEGER NOT NULL,
    id_medida_seg INTEGER NOT NULL,
    cumple BOOLEAN DEFAULT FALSE,
    observacion TEXT,
    FOREIGN KEY (id_registro_avance) REFERENCES REGISTRO_AVANCE(id_registro_avance) ON DELETE CASCADE,
    FOREIGN KEY (id_medida_seg) REFERENCES MEDIDAS_SEGURIDAD(id_medidas_seg)
);

CREATE TABLE REGISTRO_OFICIO (
    id_reg_oficio SERIAL PRIMARY KEY,
    id_registro_avance INTEGER NOT NULL,
    id_oficio INTEGER NOT NULL,
    FOREIGN KEY (id_registro_avance) REFERENCES REGISTRO_AVANCE(id_registro_avance) ON DELETE CASCADE,
    FOREIGN KEY (id_oficio) REFERENCES OFICIO(id_oficio)
);