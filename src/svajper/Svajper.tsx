import React, {
  PointerEventHandler,
  PropsWithChildren,
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

const translateXorY = (direction: Direction, px: number) =>
  `translate${direction === "horizontal" ? "X" : "Y"}(${px}px)`;

const Svajper = ({
  children,
  direction,
  selectedItemIndex,
  onDraggedToIndex,
  slideSize,
}: Props) => {
  const [dragging, setIsDragging] = useState<boolean>(false);
  const dragDelta = useRef<number>(0);
  const touchStart = useRef<number>(0);
  const indexWhenDragStart = useRef<number>(0);
  const swiperRef = useRef<HTMLDivElement>(null);
  const touchStartTranslate = useRef<string>();

  const numItems = React.Children.count(children);

  const isHorizontal = direction === "horizontal";

  const onPointerDown: PointerEventHandler<HTMLDivElement> = (e) => {
    indexWhenDragStart.current = selectedItemIndex;
    dragDelta.current = 0;
    touchStart.current = isHorizontal ? e.clientX : e.clientY;

    if (swiperRef.current) {
      touchStartTranslate.current = swiperRef.current.style.transform;
    }
    setIsDragging(true);
  };

  const onPointerMove: PointerEventHandler<HTMLDivElement> = (e) => {
    if (dragging) {
      dragDelta.current =
        (isHorizontal ? e.clientX : e.clientY) - touchStart.current;

      if (swiperRef.current) {
        swiperRef.current.style.transform = translateXorY(
          direction,
          -indexWhenDragStart.current * slideSize + dragDelta.current
        );
      }

      let currentHighlightedIndex = clamp(
        indexWhenDragStart.current + Math.round(-dragDelta.current / slideSize),
        0,
        numItems - 1
      );

      if (currentHighlightedIndex !== selectedItemIndex) {
        onDraggedToIndex(currentHighlightedIndex);
      }
    }
  };

  const onPointerUp: PointerEventHandler<HTMLDivElement> = () => {
    if (swiperRef.current) {
      swiperRef.current.style.transform = translateXorY(
        direction,
        -selectedItemIndex * slideSize
      );
    }
    setIsDragging(false);
  };

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
      ref={swiperRef}
      style={{
        transition: dragging ? "none" : undefined,
        transform: dragging
          ? touchStartTranslate.current
          : translateXorY(direction, -selectedItemIndex * slideSize),
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
