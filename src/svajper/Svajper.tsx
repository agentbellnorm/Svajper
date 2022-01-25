import React, {
  PointerEventHandler,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import styles from "./Svajper.module.scss";

export type Direction = "horizontal" | "vertical";

type Props = PropsWithChildren<{
  direction: Direction;
  selectedItemIndex: number;
  onDraggedToIndex: (index: number) => void;
  slideSize: number;
}>;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const Slajd = ({
  children,
  index,
  size,
  direction,
}: PropsWithChildren<{
  index: number;
  size: number;
  direction: Direction;
}>) => {
  return (
    <div
      className={styles.slajd}
      style={
        direction === "horizontal"
          ? { left: index * size, top: 0, width: size }
          : { top: index * size, left: 0, height: size }
      }
    >
      {children}
    </div>
  );
};

const getKey = (child: any): React.Key => {
  return child.key as React.Key;
};

const Svajper = ({
  children,
  direction,
  selectedItemIndex,
  onDraggedToIndex,
  slideSize,
}: Props) => {
  const [dragDelta, setDragDelta] = useState<number>(0);
  const [dragging, setIsDragging] = useState<boolean>(false);
  const touchStart = useRef<number>(0);
  const indexWhenDragStart = useRef<number>(0);
  const parentRef = useRef(null);

  const numItems = React.Children.count(children);

  const isHorizontal = direction === "horizontal";

  const onPointerDown: PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      setIsDragging(true);
      touchStart.current = isHorizontal ? e.clientX : e.clientY;
      indexWhenDragStart.current = selectedItemIndex;
    },
    [selectedItemIndex, isHorizontal]
  );

  const onPointerMove: PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (dragging) {
        setDragDelta(
          (isHorizontal ? e.clientX : e.clientY) - touchStart.current
        );
        const threshold = slideSize / 2;
        const shouldChangeSlide = Math.abs(dragDelta) > threshold;
        if (shouldChangeSlide) {
          let newIndex = clamp(
            indexWhenDragStart.current + Math.round(-dragDelta / slideSize),
            0,
            React.Children.count(children) - 1
          );
          onDraggedToIndex(newIndex);
        }
      }
    },
    [
      touchStart,
      dragging,
      dragDelta,
      indexWhenDragStart,
      children,
      onDraggedToIndex,
      slideSize,
      isHorizontal,
    ]
  );

  const onPointerUp: PointerEventHandler<HTMLDivElement> = useCallback(() => {
    setIsDragging(false);
    setDragDelta(0);
    touchStart.current = 0;
  }, []);

  const startIndexToRender = clamp(selectedItemIndex - 2, 0, numItems);
  const endIndexToRender = clamp(selectedItemIndex + 5, 0, numItems);

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      className={classNames(styles.svajper, {
        [styles.horizontal]: isHorizontal,
        [styles.vertical]: !isHorizontal,
      })}
      ref={parentRef}
      style={{
        transform: `translate${isHorizontal ? "X" : "Y"}(${
          dragging
            ? -indexWhenDragStart.current * slideSize + dragDelta
            : -selectedItemIndex * slideSize
        }px)`,
        transition: dragging ? "none" : undefined,
        width: isHorizontal ? `${numItems * slideSize}px` : undefined,
        height: !isHorizontal ? `${numItems * slideSize}px` : undefined,
      }}
    >
      {React.Children.toArray(children)
        .map((child, index) => ({
          child,
          index,
        }))
        .slice(startIndexToRender, endIndexToRender)
        .map(({ child, index }) => (
          <Slajd
            key={getKey(child)}
            index={index}
            size={slideSize}
            direction={direction}
          >
            {child}
          </Slajd>
        ))}
    </div>
  );
};

export default Svajper;
