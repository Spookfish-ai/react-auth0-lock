import React, { ReactNode } from "react";

import { Consumer } from "../context";

interface AuthConsumerProps {
  children: (...args: any) => ReactNode;
}

export default function AuthConsumer(props: AuthConsumerProps) {
  const { children } = props;
  return <Consumer>{(props: any) => children({ ...props })}</Consumer>;
}
