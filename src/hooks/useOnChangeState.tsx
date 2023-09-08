import React from "react";

export const useOnChangeState = <T,>(initialState?: T | null) => {
  const [state, setState] = React.useState<T>(initialState || {});

  const onChangeState: React.ChangeEventHandler<any> = React.useCallback(
    (event: React.ChangeEvent<HTMLFormElement>) => {
      const { target } = event;

      setState((prev) => ({
        ...prev,
        [target.name]: target.value,
      }));
    },
    [],
  );

  return { onChangeState, state };
};
