"use client";
import React from "react";
import { useSelector } from "react-redux";

import { AddressTextLeaderBoard } from "@shared/components/common/specialFields/SpecialFields";
import { useUser } from "@shared/context/useUser";

var endDate = Math.abs(nextDate(0) - Number(new Date())) / 1000;
// calculate (and subtract) whole days
var days = Math.floor(endDate / 86400);
endDate -= days * 86400;

// calculate (and subtract) whole hours
var hours = Math.floor(endDate / 3600) % 24;
endDate -= hours * 3600;

function nextDate(dayIndex: any) {
  var today: any = new Date();
  today.setDate(
    today.getDate() + ((dayIndex - 1 - today.getDay() + 7) % 10) + 1,
  );
  console.log(today, "next");

  return today;
}

function lastDate(dayIndex: any) {
  var today = new Date();
  today.setDate(
    today.getDate() + ((dayIndex - 1 - today.getDay() - 7) % 7) + 1,
  );
  console.log(today, "previous");
  return today;
}

function secondToLastDate(dayIndex: any) {
  var today = new Date();
  today.setDate(
    today.getDate() + ((dayIndex - 1 - today.getDay() - 7) % 14) + 1,
  );
  return today;
}

export const Leaderboard = ({ setLastWinners }: any) => {
  const [data, setData] = React.useState([]);

  const {
    user: { ethAddress: account },
  } = useUser();

  const getData = async () => {
    const [data, gameSettings] = await Promise.all([
      await (
        await fetch(
          "https://endersgate-test-server.herokuapp.com/api/v1/getPlayersRoundInfos?from=0&limit=10000",
        )
      ).json(),
      await (
        await fetch("https://endergate.herokuapp.com/api/v1/getGameSetting")
      ).json(),
    ]);

    const realData = data
      ?.map((user: any) => {
        return {
          ...user,
          histories: user.histories.filter(
            (game: any) =>
              game.finish_time < nextDate(0) && game.finish_time > lastDate(0),
          ),
        };
      })
      .map((user: any) => {
        let wins = 0,
          losses = 0,
          points = 0;
        for (let i = 0; i < user.histories.length; i++) {
          let game_result_expected = -1;
          if (user.histories[i].player1 == user.id) {
            game_result_expected = 0;
          } else {
            game_result_expected = 1;
          }
          if (user.histories[i].game_result == game_result_expected) {
            wins++;
            points += gameSettings.gameSetting.DuelPointIncrease;
          } else {
            losses++;
            points += gameSettings.gameSetting.DuelPointDecrease;
          }
        }
        return { ...user, wins: wins, losses: losses, points: points };
      })
      .sort((a: any, b: any) => b.points - a.points)
      .filter((user: any, i: any) => i < 25);

    const lastWinners = data
      ?.map((user: any) => {
        return {
          ...user,
          histories: user.histories.filter((game: any) => {
            return (
              game.finish_time < lastDate(0) &&
              game.finish_time > secondToLastDate(0)
            );
          }),
        };
      })
      .map((user: any) => {
        let wins = 0,
          losses = 0,
          points = 0;
        if (user.histories.length > 0) console.log(user.histories, "histories");
        for (let i = 0; i < user.histories.length; i++) {
          let game_result_expected = -1;
          if (user.histories[i].player1 == user.id) {
            game_result_expected = 0;
          } else {
            game_result_expected = 1;
          }
          if (user.histories[i].game_result == game_result_expected) {
            wins++;
            points += gameSettings.gameSetting.DuelPointIncrease;
          } else {
            losses++;
            points += gameSettings.gameSetting.DuelPointDecrease;
          }
          console.log(points);
        }
        return { ...user, wins: wins, losses: losses, points: points };
      })
      .sort((a: any, b: any) => b.points - a.points)
      .filter((user: any, i: any) => i < 3);

    setData(realData);
    setLastWinners(lastWinners);
  };

  React.useEffect(() => {
    // if (account) {
    getData();
    // }
  }, []);

  console.log();

  return (
    <div className="flex flex-col gap-10 sm:w-4/5 w-full relative px-4">
      <div className="bg-[#000000] text-white border border-[#c4ac6a] p-2 text-center">
        Play with honor. Cheaters will be filtered out from the leaderboard.
      </div>
      <div className="flex flex-col gap-10 w-full relative overflow-auto">
        <table className="min-w-full divide-gray-200">
          <thead className="bg-black">
            <tr>
              <th
                scope="col"
                className="px-2 py-2 text-center text-xl font-bold text-[#b8b8b8] border border-[#c4ac6a]"
              >
                POSITION
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-center text-xl font-bold text-[#b8b8b8] border border-[#c4ac6a]"
              >
                PLAYER
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-center text-xl font-bold text-[#b8b8b8] border border-[#c4ac6a]"
              >
                LEVEL
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-center text-xl font-bold text-[#b8b8b8] border border-[#c4ac6a]"
              >
                BATTLE PASS BOOST
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-center text-xl font-bold text-[#b8b8b8] border border-[#c4ac6a]"
              >
                WINS
              </th>
              <th
                scope="col"
                className="px-2 py-2 text-center text-xl font-bold text-[#b8b8b8] border border-[#c4ac6a]"
              >
                POINTS
              </th>
            </tr>
          </thead>

          <tbody>
            {data.filter((i: any, id) => i.address == account).length ? (
              data
                .sort((a: any, b: any) => b.points - a.points)
                .map((i: any, id: any) => {
                  return { ...i, rank: id + 1 };
                })
                .filter((i) => i.address == account)
                .map((user) => (
                  <tr key={user.id} className="bg-[#000000]">
                    <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#47e439] border border-[#c4ac6a]">
                      {user.rank}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#47e439] border border-[#c4ac6a]">
                      YOU (
                      <AddressTextLeaderBoard text={account} />)
                    </td>{" "}
                    <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#47e439] border border-[#c4ac6a]">
                      {user.level}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#47e439] border border-[#c4ac6a]">
                      {"1x"}
                    </td>{" "}
                    <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#47e439] border border-[#c4ac6a]">
                      {user.wins}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#47e439] border border-[#c4ac6a]">
                      {user.points}
                    </td>
                  </tr>
                ))
            ) : (
              <tr className="bg-[#000000]">
                <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#b8b8b8] border border-[#c4ac6a]">
                  Unranked
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#47e439] border border-[#c4ac6a]">
                  YOU (
                  <AddressTextLeaderBoard text={account} />)
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#47e439] border border-[#c4ac6a]">
                  0
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#47e439] border border-[#c4ac6a]">
                  {"1x"}
                </td>
                <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#47e439] border border-[#c4ac6a]">
                  0
                </td>{" "}
                <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#47e439] border border-[#c4ac6a]">
                  0
                </td>
              </tr>
            )}
            {data
              .sort((a: any, b: any) => b.points - a.points)
              .filter((i, id) => id < 25)
              .map((user: any, i) => {
                return (
                  <tr key={user.id} className="">
                    <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#b8b8b8] border border-[#c4ac6a]">
                      {i + 1}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#b8b8b8] border border-[#c4ac6a]">
                      <AddressTextLeaderBoard text={user.address} />
                    </td>{" "}
                    <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#b8b8b8] border border-[#c4ac6a]">
                      {user.level}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#b8b8b8] border border-[#c4ac6a]">
                      -
                    </td>{" "}
                    <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#b8b8b8] border border-[#c4ac6a]">
                      {user.wins}
                    </td>
                    <td className="px-2 py-2 whitespace-nowrap text-lg text-center text-[#b8b8b8] border border-[#c4ac6a]">
                      {user.points}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
