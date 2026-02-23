import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../common/Button";
import { CardObra } from "../common/CardObra";
import { useAuthApi } from "../../hooks/useAuthApi";

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
      
    </>
  );
}
export default Home;