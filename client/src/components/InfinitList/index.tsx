import React from "react";
import {
  FixedSizeList,
  FixedSizeListProps,
  ListChildComponentProps,
  areEqual
} from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

interface Props<ItemType = any>
  extends Omit<
    FixedSizeListProps,
    "children" | "itemCount" | "width" | "height"
  > {
  // Are there more items to load?
  // (This information comes from the most recent API request.)
  hasNextPage: boolean | undefined;

  // Are we currently loading a page of items?
  // (This may be an in-flight flag in your Redux store for example.)
  loading: boolean | undefined;

  // Array of items loaded so far.
  items: ItemType[];

  // Callback function responsible for loading the next page of items.
  loadNextPage: () => any;

  renderItem: (
    rowProps: ListChildComponentProps
  ) => React.ReactElement | undefined;
}

const InfinitList: React.FC<Props> = ({
  hasNextPage,
  loading,
  items,
  loadNextPage,
  renderItem,
  ...props
}) => {
  const [listDemension, setListDemension] = React.useState({
    width: 0,
    height: 0
  });
  const listBoxRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    setListDemension({
      width: Number(listBoxRef?.current?.clientWidth),
      height: Number(listBoxRef?.current?.clientHeight)
    });
  }, []);

  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = items.length + (hasNextPage ? 1 : 0);

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = () => {
    if (!loading) {
      loadNextPage();
    }
    return null;
  };

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = (index: number) => !hasNextPage || index < items.length;

  // If list items are expensive to render,
  // Consider using React.memo or shouldComponentUpdate to avoid unnecessary re-renders.
  // https://reactjs.org/docs/react-api.html#reactmemo
  // https://reactjs.org/docs/react-api.html#reactpurecomponent
  const renderRow = React.memo((rowProps: ListChildComponentProps) => {
    const { index, style } = rowProps;

    if (!isItemLoaded(index)) {
      return (
        <div style={style} key={index}>
          Loading...
        </div>
      );
    } else {
      return renderItem(rowProps) || <div style={style} key={index} />;
    }
  }, areEqual);

  return (
    <div
      ref={listBoxRef}
      style={{ display: "flex", width: "100%", height: "100%" }}
    >
      <InfiniteLoader
        isItemLoaded={isItemLoaded}
        itemCount={itemCount}
        loadMoreItems={loadMoreItems}
      >
        {({ onItemsRendered, ref }) => (
          <FixedSizeList
            itemData={items}
            itemCount={itemCount}
            onItemsRendered={onItemsRendered}
            ref={ref}
            width={listDemension.width}
            height={listDemension.height}
            {...props}
          >
            {renderRow}
          </FixedSizeList>
        )}
      </InfiniteLoader>
    </div>
  );
};

export default InfinitList;
