import { useState, useEffect } from "react";

export default function useSVGBBox(contentRef, deps = []) {

  const [bbox, setBBox] = useState(null);

  useEffect(() => {

    if (!contentRef.current) return;

    const box = contentRef.current.getBBox();

    setBBox(box);

  }, deps);

  return bbox;
}