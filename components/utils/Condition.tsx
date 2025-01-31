import { FC, ReactNode } from "react";

interface ConditionProps {
  if: unknown;
  render: ReactNode;
  else?: ReactNode;
}

interface ConditionProps {
  if: unknown;
  render: ReactNode;
  else?: ReactNode;
}

const Condition: FC<ConditionProps> = ({
  if: condition,
  render,
  else: elseRender = <></>,
}) => {
  return <>{condition ? render : elseRender}</>;
};

export default Condition;
