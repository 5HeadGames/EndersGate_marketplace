import { XIcon } from "@heroicons/react/solid";
import { Image } from "@chakra-ui/react";
import { useRouter } from "next/router";

export const CongratsListing = ({ hide, name }) => {
  const router = useRouter();

  return (
    <div
      style={{ width: "90vw", maxWidth: "375px" }}
      className="relative bg-overlay flex flex-col items-center gap-4 jusify-center shadow-2xl rounded-2xl mt-36"
    >
      <Image
        src="/images/comicsbg.png"
        className="w-full opacity-25 absolute top-0"
        alt=""
      />
      <Image
        src="/images/comics.svg"
        className="absolute"
        width={"275px"}
        top={"-175px"}
        alt=""
      />
      <div className="absolute h-full w-full rounded-2xl bg-gradient-to-b from-transparent to-overlay px-2 from-0% to-30% "></div>
      <div className="absolute top-2 right-2 flex justify-end w-full py-2">
        <XIcon
          className="text-white w-5 cursor-pointer p-[2px] rounded-full bg-overlay border border-white"
          onClick={() => {
            hide();
          }}
        />
      </div>
      <div className="flex flex-col items-center justify-center relative rounded-full px-6 pt-16 pb-8 gap-2">
        <h2 className="text-white text-center font-bold text-5xl text-red-alert">
          Success!
        </h2>{" "}
        <p className="text-center text-white text-lg py-4">
          You've successfully listed {name} NFT/s on the EndersGate Marketplace!
        </p>
        <a
          href={`https://twitter.com/intent/tweet?text=I'm so excited to announce that I just have listed a ${name} from Enders Gate! Get yours on: https://marketplace.endersgate.gg`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src="/images/share.png" className="h-12 cursor-pointer" alt="" />
        </a>
      </div>
    </div>
  );
};
