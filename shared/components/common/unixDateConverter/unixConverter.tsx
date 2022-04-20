/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";

export const TimeConverter: React.FC<any> = ({ UNIX_timestamp }) => {
  const [time, setTime] = React.useState("");

  React.useEffect(() => {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    console.log(a);
    setTime(
      month + " " + date + " " + year + " " + hour + ":" + min + ":" + sec
    );
  }, []);

  return <>{time}</>;
};
