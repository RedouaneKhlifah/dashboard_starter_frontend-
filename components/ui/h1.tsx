import { PropsWithChildren } from "react";

export default function H1({ children }: PropsWithChildren) {
  return (
    <h1 className="scroll-m-20 text-4xl font-semibold lg:text-5xl">
      {children}
    </h1>
  );
}
