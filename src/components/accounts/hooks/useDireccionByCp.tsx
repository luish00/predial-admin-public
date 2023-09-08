import React, { useMemo } from "react";
import { CP_SINALOA } from "../../../cp_sin";

export const useDireccionByCp = (postalCode: string) => {
  const cityOptionsByCp = useMemo(() => {
    if (postalCode && postalCode.length < 5) {
      return null;
    }

    return (
      Array.from(new Set(CP_SINALOA
        .filter((item) => String(item.cp) === postalCode)
        .map(item => item.town)
      )).map((item, index) => (
        <option key={String(index)} value={item}>{item}</option>
      ))
    );
  }, [postalCode]);

  const towshipOptionsByCp = useMemo(() => {
    if (postalCode && postalCode.length < 5) {
      return null;
    }

    return (
      Array.from(new Set(CP_SINALOA
        .filter((item) => String(item.cp) === postalCode)
        .map(item => item.township)
      )).map((item, index) => (
        <option key={String(index)} value={item}>{item}</option>
      ))
    );
  }, [postalCode]);

  const stateOptionsByCp = useMemo(() => {
    if (postalCode && postalCode.length < 5) {
      return null;
    }

    return (
      Array.from(new Set(CP_SINALOA
        .filter((item) => String(item.cp) === postalCode)
        .map(item => item.state)
      )).map((item, index) => (
        <option key={String(index)} value={item}>{item}</option>
      ))
    );
  }, [postalCode]);

  return { cityOptionsByCp, stateOptionsByCp, towshipOptionsByCp};
};
