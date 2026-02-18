import React from "react";
import Home from "../components/home/Home";

const Dashboard: React.FC = () => {

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 lg:p-10">
        <Home />
      </main>
    </div>

  );
};

export default Dashboard;
