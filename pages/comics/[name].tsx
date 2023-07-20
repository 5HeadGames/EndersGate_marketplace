import { ComicSlider } from "@shared/components/Comics/ComicSliders/ComicSlider";
import React from "react";
import comics from "@shared/comics.json";

const ComicPage = () => {
  return <ComicSlider />;
};

// export async function getStaticPaths() {
//   const paths = comics.map(({ nameLink }: any) => {
//     return { params: { name: nameLink } };
//   });

//   console.log(paths);

//   return {
//     paths: paths,
//     fallback: false, // can also be true or 'blocking'
//   };
// }

export default ComicPage;
