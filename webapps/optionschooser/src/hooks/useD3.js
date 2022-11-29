import { useRef, useEffect } from "react";
import * as d3 from 'd3';
const useD3 = (d3Fn, dependencies) => {
    const ref = useRef();
    useEffect(() => {
        d3Fn(d3.select(ref.current));
        return () => {};
    }, dependencies);
    return ref;
}

export default useD3;