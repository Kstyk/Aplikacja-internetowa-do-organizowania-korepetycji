import React from "react";
import Toolbar from "react-big-calendar/lib/Toolbar";

class CustomToolbar extends Toolbar {
  render() {
    return (
      <div className="flex justify-center md:justify-between mb-3 z-30 px-3 md:px-0 flex-col md:flex-row items-center">
        <span className="rbc-btn-group">
          <button
            className="btn btn-outline no-animation min-h-0 h-8 rounded-none hover:bg-base-400 hover:text-white"
            type="button"
            onClick={() => this.navigate("TODAY")}
          >
            Dzisiaj
          </button>
          <button
            className="btn btn-outline no-animation min-h-0 h-8 rounded-none hover:bg-base-400 hover:text-white"
            type="button"
            onClick={() => this.navigate("PREV")}
          >
            Do tyłu
          </button>
          <button
            className="btn btn-outline no-animation min-h-0 h-8 rounded-none hover:bg-base-400 hover:text-white"
            type="button"
            onClick={() => this.navigate("NEXT")}
          >
            Do przodu
          </button>
        </span>
        <span className="rbc-toolbar-label text-center">
          {this.props.label}
        </span>
      </div>
    );
  }
}

export default CustomToolbar;
