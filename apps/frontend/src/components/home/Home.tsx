import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../common/Button";
import { CardObra } from "../common/CardObra";

const Home: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <>
      <h2 className="text-3xl font-bold mb-4">Dashboard RenoArg</h2>

      {user && (
        <p className="text-2xl mb-6">Bienvenid@ {user.name}</p>
      )}

      <Button
        variant="secondary"
        className="mb-8"
        onClick={logout}
      >
        Cerrar sesión
      </Button>

      {/* Mock de obras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardObra
          codigo="RENO-AR-2026-014"
          titulo="Reforma vivienda unifamiliar"
          ubicacion="Barrio Caballito, CABA"
          artStatus="ok"
          seguridadStatus="ok"
          progreso={45}
          responsable="Arq. Laura Perez"
          onDetalle={() => console.log("detalle 1")}
        />

        <CardObra
          codigo="RENO-AR-2026-015"
          titulo="Local comercial - Av. Santa Fé"
          ubicacion="Palermo, CABA"
          artStatus="ok"
          seguridadStatus="warning"
          progreso={82}
          responsable="Arq. Natasha Marco"
          onDetalle={() => console.log("detalle 2")}
        />
      </div>
    </>
  );
};

export default Home;