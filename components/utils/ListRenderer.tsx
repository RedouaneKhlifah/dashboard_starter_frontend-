// ListRenderer.tsx
import { ReactElement } from "react";

interface ListRendererProps<T> {
  data: T[];
  renderItem: (item: T) => ReactElement;
  className?: string;
}

const ListRenderer = <T,>({
  data,
  renderItem,
  className,
}: ListRendererProps<T>) => {
  return (
    <>
      {data.map((item: T, index) => (
        <div className={className} key={index}>
          {renderItem(item)}
        </div>
      ))}
    </>
  );
};

export default ListRenderer;
