"use client";
import React from "react";
import { CompetitiveLanding } from "./CompetitiveLanding";
import { WeeklyTournament } from "./WeeklyTournament";
import { Leaderboard } from "./Leaderboard";

const CompetitiveComponent = () => {
  const [lastWinners, setLastWinners] = React.useState([]);

  return (
    <>
      <div className="bg-[#000000] min-h-screen flex flex-col gap-16 items-center justify-center w-full pb-16">
        <CompetitiveLanding />
        {/* <BattlePassProgress show={show} priceUSD={priceUSD} /> */}
        <WeeklyTournament lastWinners={lastWinners} />
        <Leaderboard setLastWinners={setLastWinners} />
      </div>
    </>
  );
};

export default CompetitiveComponent;
