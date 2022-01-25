import React, {
  PointerEventHandler,
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import styles from "./Svajper.module.scss";

type Props = PropsWithChildren<{
  direction: "horizontal" | "vertical";
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
}: PropsWithChildren<{
  index: number;
  size: number;
}>) => {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        left: index * size,
        top: 0,
      }}
    >
      {children}
    </div>
  );
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

  const onPointerDown: PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      setIsDragging(true);
      touchStart.current = e.clientX;
      indexWhenDragStart.current = selectedItemIndex;
    },
    [selectedItemIndex]
  );

  useEffect(() => {
    console.log("selectedItemIndex", selectedItemIndex);
  }, [selectedItemIndex]);

  const onPointerMove: PointerEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      if (dragging) {
        setDragDelta(e.clientX - touchStart.current);
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
        [styles.horizontal]: direction === "horizontal",
        [styles.vertical]: direction === "vertical",
      })}
      ref={parentRef}
      style={{
        transform: `translateX(${
          dragging
            ? -indexWhenDragStart.current * slideSize + dragDelta
            : -selectedItemIndex * slideSize
        }px)`,
        transition: dragging ? "none" : undefined,
        width: `${numItems * slideSize}px`,
      }}
    >
      {React.Children.toArray(children)
        .map((child, index) => ({
          child,
          index,
        }))
        .slice(startIndexToRender, endIndexToRender)
        .map(({ child, index }) => (
          <Slajd index={index} size={slideSize}>
            {child}
          </Slajd>
        ))}
    </div>
  );
};

export default Svajper;
