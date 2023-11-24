import React from 'react'
import Toolbar from 'react-big-calendar/lib/Toolbar'

class CustomToolbarNoLegend extends Toolbar {
  render() {
    return (
      <div className="z-30 mb-3">
        <div className="flex flex-col items-center justify-center px-3 md:flex-row md:justify-between md:px-0">
          <span className="rbc-btn-group">
            <button
              className="btn-outline no-animation btn h-8 min-h-0 rounded-none hover:bg-base-400 hover:text-white"
              type="button"
              onClick={() => this.props.onNavigate('TODAY')}
            >
              Dzisiaj
            </button>
            <button
              className={`btn-outline no-animation btn h-8 min-h-0 rounded-none hover:bg-base-400 hover:text-white`}
              type="button"
              onClick={() => this.props.onNavigate('PREV')}
              disabled={this.props.isMinDateReached}
            >
              Do tyłu
            </button>
            <button
              className={`btn-outline no-animation btn h-8 min-h-0 rounded-none hover:bg-base-400 hover:text-white`}
              type="button"
              onClick={() => this.props.onNavigate('NEXT')}
              disabled={this.props.isMaxDateReached}
            >
              Do przodu
            </button>
          </span>
          <span className="rbc-toolbar-label text-center">
            {this.props.label}
          </span>
        </div>
      </div>
    )
  }
}

export default CustomToolbarNoLegend
