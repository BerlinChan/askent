import React from "react";
import {
  FixedSizeList,
  FixedSizeListProps,
  ListChildComponentProps
} from "react-window";
import InfiniteLoader from "react-window-infinite-loader";

interface Props<ItemType = any>
  extends Omit<FixedSizeListProps, "children" | "itemCount"> {
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

  renderItem: (rowProps: ListChildComponentProps) => React.ReactElement;
}

const InfinitList: React.FC<Props> = ({
  hasNextPage,
  loading,
  items,
  loadNextPage,
  renderItem,
  ...props
}) => {
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
  const isItemLoaded = (index: number) => hasNextPage || index < items.length;

  // Render an item or a loading indicator.
  const renderRow = (rowProps: ListChildComponentProps) => {
    const { index, style } = rowProps;

    if (!isItemLoaded(index)) {
      return (
        <div style={style} key={index}>
          Loading...
        </div>
      );
    } else {
      return renderItem(rowProps);
    }
  };

  return (
    <InfiniteLoader
      isItemLoaded={isItemLoaded}
      itemCount={itemCount}
      loadMoreItems={loadMoreItems}
    >
      {({ onItemsRendered, ref }) => (
        <FixedSizeList
          itemCount={itemCount}
          onItemsRendered={onItemsRendered}
          ref={ref}
          {...props}
        >
          {renderRow}
        </FixedSizeList>
      )}
    </InfiniteLoader>
  );
};

export default InfinitList;
