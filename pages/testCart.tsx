import { addCart } from "@redux/actions";
import { useAppDispatch } from "@redux/store";
import { Button } from "@shared/components/common/button/button";
import { Icons } from "@shared/const/Icons";
import React from "react";
import { useSelector } from "react-redux";

const Empty = () => {
  const dispatch = useAppDispatch();
  const { cart } = useSelector((state: any) => state.layout);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center">
      <img src={Icons.logo} className="h-24 w-24" alt="" />
      <h2 className="text-primary mt-10">Coming Soon</h2>
      {cart.map((item) => (
        <div className="flex w-full items-center justify-center text-white gap-4">
          <p>{item.id}</p>
          <h2>{item.name}</h2>
        </div>
      ))}
      <Button
        onClick={() => {
          dispatch(addCart({ name: "mamador", id: 2 }));
        }}
        className="p-4 text-white rounded-xl mt-2"
      >
        add Cart
      </Button>
    </div>
  );
};

export default Empty;
