import React, { useState } from "react";
import "./App.scss";
import Svajper from "./svajper/Svajper";
import classNames from "classnames";

const items: string[] = Array.from(Array(1000).keys()).map(
  (_) => `#${Math.floor(Math.random() * 16777215).toString(16)}`
);

function App() {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  return (
    <div>
      <div className="App">
        <Svajper
          onDraggedToIndex={(i) => setSelectedItemIndex(i)}
          selectedItemIndex={selectedItemIndex}
          direction={"vertical"}
          slideSize={260} // width or height depending on direction
        >
          {items.map((i, idx) => (
            <div
              key={`${i}-${idx}`}
              className={classNames("shelfCard", {
                ["selected"]: idx === selectedItemIndex,
              })}
              style={{ backgroundColor: i }}
            >
              <img src="https://picsum.photos/160/160" />
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
      </div>
    </div>
  );
}

export default App;
