import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ScrollToTop() {
  const { asPath } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [asPath]);

  return null;
}
