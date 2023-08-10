import React from "react";
import Toolbar from "react-big-calendar/lib/Toolbar";

class CustomToolbarNoButtons extends Toolbar {
  render() {
    return (
      <div className="flex justify-center mb-3">
        <span className="rbc-toolbar-label text-center">
          {this.props.label}
        </span>
      </div>
    );
  }
}

export default CustomToolbarNoButtons;
