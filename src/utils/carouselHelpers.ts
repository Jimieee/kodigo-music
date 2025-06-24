export const createGridColumns = <T>(
  items: T[],
  useFixedWidthGrid: boolean,
  itemsPerColumn: number,
  columnsPerSlide: number = 1
) => {
  const columns = [];
  const itemsPerSlide = itemsPerColumn * columnsPerSlide;

  if (useFixedWidthGrid) {
    for (let i = 0; i < items.length; i += itemsPerColumn) {
      const columnItems = items.slice(i, i + itemsPerColumn);
      columns.push(columnItems);
    }
  } else {
    for (let i = 0; i < items.length; i += itemsPerSlide) {
      const slideItems = items.slice(i, i + itemsPerSlide);
      const slideColumns = [];

      for (let j = 0; j < columnsPerSlide; j++) {
        const columnItems = [];
        for (let k = 0; k < itemsPerColumn; k++) {
          const itemIndex = j * itemsPerColumn + k;
          if (slideItems[itemIndex]) {
            columnItems.push(slideItems[itemIndex]);
          }
        }
        if (columnItems.length > 0) {
          slideColumns.push(columnItems);
        }
      }

      if (slideColumns.length > 0) {
        columns.push(slideColumns);
      }
    }
  }

  return columns;
};
