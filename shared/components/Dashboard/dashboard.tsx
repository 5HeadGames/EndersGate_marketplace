import { Icons } from "@shared/const/Icons";
import React from "react";
import Table from "./tableItems/table";
import TransactionsBoard from "./TransactionsBoard/TransactionsBoard";

const DashboardComponent = () => {
  return (
    <div className="w-full flex flex-col md:px-16 px-4 min-h-screen">
      <TransactionsBoard />
      <div className="grid xl:grid-cols-2 grid-cols-1 xl:gap-8 gap-6 mt-6">
        <Table title="Recently Listed" />
        <Table title="Recently Sold" />
      </div>
    </div>
  );
};

export default DashboardComponent;
