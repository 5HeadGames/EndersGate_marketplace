import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ScrollToTop() {
  const { asPath } = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [asPath]);

  return null;
}
