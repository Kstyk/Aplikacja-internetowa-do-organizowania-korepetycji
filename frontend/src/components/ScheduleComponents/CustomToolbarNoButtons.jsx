import React from 'react'
import Toolbar from 'react-big-calendar/lib/Toolbar'

class CustomToolbarNoButtons extends Toolbar {
  render() {
    return (
      <div className="mb-3 flex justify-center">
        <span className="rbc-toolbar-label text-center">
          {this.props.label}
        </span>
      </div>
    )
  }
}

export default CustomToolbarNoButtons
