import { useBlockchain } from "@shared/context/useBlockchain";
import clsx from "clsx";

// get total seconds between the times
var endDate = Math.abs(Number(nextDate(0)) - Number(new Date())) / 1000;
// calculate (and subtract) whole days
var days = Math.floor(endDate / 86400);
endDate -= days * 86400;

// calculate (and subtract) whole hours
var hours = Math.floor(endDate / 3600) % 24;
endDate -= hours * 3600;

function nextDate(dayIndex: any) {
  var today = new Date();
  today.setDate(
    today.getDate() + ((dayIndex - 1 - today.getDay() + 7) % 7) + 1,
  );
  return today;
}

function lastDate(dayIndex: any) {
  var today = new Date();

  today.setDate(
    today.getDate() + ((dayIndex - 1 - today.getDay() - 7) % 7) + 1,
  );
  console.log(today, "DATE");
  return today;
}

function newLastDate(dayIndex: any) {
  var now = new Date();

  var futureDate = new Date();
  futureDate.setDate(
    futureDate.getDate() + ((dayIndex - 1 - futureDate.getDay() + 7) % 7) + 1,
  );

  // Set hours, minutes, seconds and milliseconds to 0 to get the date at 00:00
  futureDate.setHours(0, 0, 0, 0);

  // Calculate the difference in milliseconds
  var diff = futureDate.getTime() - now.getTime();

  // Convert difference in milliseconds to days and hours
  var daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
  var hoursDiff = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  console.log("Days: " + daysDiff + ", Hours: " + hoursDiff);
  return { days: daysDiff, hours: hoursDiff };
}

const currentRewards = [
  { name: "Epic Pack", image: "/images/packs/epic1080.png" },
  { name: "Rare Pack", image: "/images/packs/rare1080.png" },
  { name: "Common Pack", image: "/images/packs/common1080.png" },
];

const nextRewards = [
  { name: "Epic Pack", image: "/images/packs/epic1080.png" },
  { name: "Rare Pack", image: "/images/packs/rare1080.png" },
  { name: "Common Pack", image: "/images/packs/common1080.png" },
];

export const WeeklyTournament = ({ lastWinners }: any) => {
  const { blockchain } = useBlockchain();
  return (
    <div className="flex flex-col gap-10 items-center justify-center sm:w-4/5 w-full relative overflow-hidden px-4">
      <img
        src="/images/bgBattlePass.png"
        className="w-full h-full absolute"
        alt=""
      />
      <div className="flex flex-col gap-2 items-center justify-center w-full rounded-2xl p-2 py-4 border-2 border-white relative">
        <img
          src="/images/weekly_tournament.png"
          className="w-auto sm:h-8 xs:h-6 h-5"
          alt=""
        />
        <h2 className="text-xl text-[#b8b8b8] text-center">
          SECURE AN AIRDROP BY PLAYING EACH WEEK!
        </h2>
        <div className="flex md:flex-row flex-col gap-6 w-full">
          <div className="flex flex-col gap-2 md:w-1/3 w-full p-2">
            <div className="flex flex-col rounded-xl border border-[#1a1a1a]">
              <div className=" flex flex-col items-center justify-center p-1">
                <h2 className="text-md text-white font-bold">
                  Last Week Winners:
                </h2>
                <h2 className="text-md text-[#b8b8b8] font-bold">
                  {/* ⏱️ Ended {lastDate(0).toLocaleDateString()} */}
                </h2>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 w-full opacity-25 relative h-full py-10">
                <img
                  src="/images/battlepass_free.png"
                  className="w-44"
                  alt=""
                />
                <h2 className="text-3xl font-bold text-[#b8b8b8]">
                  Coming Soon
                </h2>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 md:w-1/3 w-full md:border-l md:border-r border-white p-2">
            <div className="flex flex-col w-56 items-center justify-center rounded-2xl p-3 border border-[#1a1a1a]">
              <h2 className="text-md font-bold text-[#47e439] text-center">
                Tournament Ends in:
              </h2>
              <h3 className="text-3xl font-bold text-[#b8b8b8] text-center">
                ⏱️ {newLastDate(0).days}d {newLastDate(0).hours}h
              </h3>
            </div>
            <div className="flex gap-1">
              <div className="flex flex-col gap-1 w-1/3 p-1">
                <div className="rounded-xl border border-[#1a1a1a]">
                  <img src={currentRewards[1].image} className="p-2" alt="" />
                </div>{" "}
                <h2 className="text-sm text-center text-white">
                  2nd Place Reward
                </h2>
              </div>
              <div className="flex flex-col gap-1 w-1/3 p-1">
                <div className="rounded-xl border border-[#1a1a1a]">
                  <img src={currentRewards[0].image} className="p-2" alt="" />
                </div>
                <h2 className="text-sm text-center text-[#c4ac6a]">
                  1st Place Reward
                </h2>
              </div>
              <div className="flex flex-col gap-1 w-1/3 p-1">
                <div className="rounded-xl border border-[#1a1a1a]">
                  <img src={currentRewards[2].image} className="p-2" alt="" />
                </div>
                <h2 className="text-sm text-center text-[#944d24]">
                  3rd Place Reward
                </h2>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-xl text-[#b8b8b8] text-center">
                Tournament Rules:
              </h2>{" "}
              <p className="text-[#b8b8b8] text-sm text-center">
                1. Play Enders Gate Matches to earn Duel Points. <br />
                2. Duel points are earned by Winning matches against opponents.{" "}
                <br />
                3. Cheaters will be filtered out automatically. <br />
                4. All devices are eligible. <br />
                5. No purchase necessary to participate.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:w-1/3 w-full p-2">
            <div className="flex flex-col rounded-xl border border-[#1a1a1a]">
              <div className=" flex flex-col items-center justify-center p-1">
                <h2 className="text-md text-[#c4ac6a] font-bold">
                  Next Week Rewards:
                </h2>
                <h2 className="text-md text-[#b8b8b8] font-bold">
                  ⏱️ Starts {nextDate(1).toLocaleDateString()}
                </h2>
              </div>
              <div className="border-t border-[#1a1a1a] flex flex-col pb-2">
                <div className="flex items-center justify-center">
                  <h2 className="text-md text-[#c4ac6a] font-bold px-2 w-full text-center">
                    1st Place
                  </h2>
                </div>
                <div className="flex items-center justify-center px-4">
                  <div className="rounded-xl border border-[#1a1a1a] flex items-center justify-center w-full p-2 gap-3">
                    <div
                      className={clsx(
                        "rounded-xl flex flex-col text-gray-100 cursor-pointer relative overflow-hidden border border-gray-500 w-20 h-20",
                      )}
                    >
                      <img
                        src={nextRewards[0].image}
                        className={`absolute`}
                        style={{ top: "-30%" }}
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col justify-between sm:w-4/5 w-full h-20">
                      <h2 className="text-white text-md font-bold">
                        Epic EG Pack
                      </h2>
                      <div className="flex gap-2 items-end">
                        <img src="/icons/logo.png" className="w-10" alt="" />
                        <img
                          src={`/icons/${blockchain}.svg`}
                          className="w-7"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-[#1a1a1a] flex flex-col pb-2">
                <div className="flex items-center justify-center">
                  <h2 className="text-md text-white font-bold px-2 w-full text-center">
                    2nd Place
                  </h2>
                </div>
                <div className="flex items-center justify-center px-4">
                  <div className="rounded-xl border border-[#1a1a1a] flex items-center justify-center w-full p-2 gap-3">
                    <div
                      className={clsx(
                        "rounded-xl flex flex-col text-gray-100 cursor-pointer relative overflow-hidden border border-gray-500 w-20 h-20",
                      )}
                    >
                      <img
                        src={nextRewards[1].image}
                        className={`absolute`}
                        style={{ top: "-30%" }}
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col justify-between sm:w-4/5 w-full h-20">
                      <h2 className="text-white text-md font-bold">
                        Rare EG Pack
                      </h2>
                      <div className="flex gap-2 items-end">
                        <img src="/icons/logo.png" className="w-10" alt="" />
                        <img
                          src={`/icons/${blockchain}.svg`}
                          className="w-7"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>{" "}
              <div className="border-t border-[#1a1a1a] flex flex-col pb-2">
                <div className="flex items-center justify-center">
                  <h2 className="text-md text-[#944d24] font-bold px-2 w-full text-center">
                    3rd Place
                  </h2>
                </div>
                <div className="flex items-center justify-center px-4">
                  <div className="rounded-xl border border-[#1a1a1a] flex items-center justify-center w-full p-2 gap-3">
                    <div
                      className={clsx(
                        "rounded-xl flex flex-col text-gray-100 cursor-pointer relative overflow-hidden border border-gray-500 w-20 h-20",
                      )}
                    >
                      <img
                        src={nextRewards[2].image}
                        className={`absolute`}
                        style={{ top: "-30%" }}
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col justify-between sm:w-4/5 w-full h-20">
                      <h2 className="text-white text-md font-bold">
                        Common EG Pack
                      </h2>
                      <div className="flex gap-2 items-end">
                        <img src="/icons/logo.png" className="w-10" alt="" />
                        <img
                          src={`/icons/${blockchain}.svg`}
                          className="w-7"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
