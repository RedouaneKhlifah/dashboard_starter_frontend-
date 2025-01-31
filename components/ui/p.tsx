import { PropsWithChildren } from "react";

export default function P({ children }: PropsWithChildren) {
  return <p className="leading-7 [&:not(:first-child)]:mt-4">{children}</p>;
}
