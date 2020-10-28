import { ReactNode } from "react";
interface AuthConsumerProps {
    children: (...args: any) => ReactNode;
}
export default function AuthConsumer(props: AuthConsumerProps): JSX.Element;
export {};
