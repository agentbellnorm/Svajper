import React, { useState } from "react";
import "./App.scss";
import Svajper, { Direction } from "./svajper/Svajper";
import classNames from "classnames";

const items: string[] = Array.from(Array(1000).keys()).map(
  (_) => `#${Math.floor(Math.random() * 16777215).toString(16)}`
);

const size: Record<Direction, number> = {
  horizontal: 200,
  vertical: 260,
};

function App() {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [direction, setDirection] = useState<Direction>("horizontal");
  return (
    <div>
      <div className="App">
        <Svajper
          onDraggedToIndex={(i) => setSelectedItemIndex(i)}
          selectedItemIndex={selectedItemIndex}
          direction={direction}
          slideSize={size[direction]} // width or height depending on direction
        >
          {items.map((i, idx) => (
            <div
              key={`${i}-${idx}`}
              className={classNames("shelfCard", {
                selected: idx === selectedItemIndex,
              })}
              style={{ backgroundColor: i }}
            >
              <img alt="carpe diem" src="https://picsum.photos/160/160" />
              <p>Carpe diem</p>
            </div>
          ))}
        </Svajper>
      </div>
      <div className="devControls">
        {" "}
        {selectedItemIndex > 0 && (
          <button onClick={() => setSelectedItemIndex(selectedItemIndex - 1)}>
            {"<-"}
          </button>
        )}
        {selectedItemIndex < items.length - 1 && (
          <button onClick={() => setSelectedItemIndex(selectedItemIndex + 1)}>
            {"->"}
          </button>
        )}
        <button onClick={() => setSelectedItemIndex(0)}>{"Reset"}</button>
        <select
          onChange={(event) => setDirection(event.target.value as Direction)}
        >
          <option value={"horizontal"}>Horizontal</option>
          <option value={"vertical"}>Vertical</option>
        </select>
      </div>
    </div>
  );
}

export default App;
