import { FC } from "react";
import cn from "classnames";

import "./index.css";

interface Props {
  Component: React.ReactElement | null;
}

export const Sidebar: FC<Props> = ({ Component }) => {
  return (
    <div
      className={cn("tile is-parent is-8-desktop Sidebar", {
        "Sidebar--open": !!Component,
      })}
    >
      <div className="tile is-child box is-success ">
        <div className="tile is-child box is-success ">
          <div className="content">{Component}</div>
        </div>
      </div>
    </div>
  );
};
