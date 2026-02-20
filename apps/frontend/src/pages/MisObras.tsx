import React from "react";
import PlaceholderActionLink from "../components/common/PlaceholderActionLink";
import PlaceholderScreen from "../components/common/PlaceholderScreen";
import { ROUTES } from "../constants/routes";

const MisObras: React.FC = () => {
  return (
    <PlaceholderScreen
      title="Mis obras"
      description="Listado de obras. Vista temporal para integrar diseno UX."
    >
      <div className="flex gap-3">
        <PlaceholderActionLink to='/dashboard/mis-obras/nueva' label="+ Nueva obra" />
      </div>
    </PlaceholderScreen>
  );
};

export default MisObras;

