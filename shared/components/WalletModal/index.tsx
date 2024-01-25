"use client";
import React from "react";
import Image from "next/image";

import Modal from "components/common/modal";
import { WALLETS } from "utils/connection/utils";
import { Connection } from "utils/connection";
import { useRouter } from "next/navigation";

interface WalletModalProps {
  showModal: boolean;
  setShowModal: (nxt: boolean) => void;
}

const ConnectionComponent: React.FunctionComponent<{
  connection: Connection;
  onSelect: Function;
  src: string;
  title: string;
}> = (props) => {
  const { connection, onSelect, src, title } = props;

  const router = useRouter();

  const handleConnection = async () => {
    try {
      await connection.connector.activate();
    } catch (err) {
      console.log({ err });
    }
    onSelect();
    router.push("/marketplace");
  };

  return (
    <button className="hover:scale-125" onClick={handleConnection}>
      <Image src={src} alt="me" width="64" height="64" />
      <p>{title}</p>
    </button>
  );
};

export const WalletModal: React.FunctionComponent<WalletModalProps> = ({
  showModal,
  setShowModal,
}) => {
  return (
    <Modal
      content={
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="grid grid-cols-3 gap-4">
            {WALLETS.map((k, i) => (
              <ConnectionComponent
                onSelect={() => setShowModal(false)}
                src={k.src}
                title={k.title}
                connection={k.connection}
              />
            ))}
          </div>
        </div>
      }
      showModal={showModal}
      setShowModal={setShowModal}
      showBtn={false}
    />
  );
};

export default WalletModal;
