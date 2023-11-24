import React from 'react'
import Toolbar from 'react-big-calendar/lib/Toolbar'

class CustomToolbar extends Toolbar {
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
        <div className="flex w-full flex-col justify-center gap-x-3 pt-3 text-sm phone:flex-row phone:text-base">
          <div className="legend-item flex flex-row items-center gap-x-2">
            <div className="h-4 w-6 bg-blue-200"></div>
            <span>Zajęcia Online</span>
          </div>
          <div className="legend-item flex flex-row items-center gap-x-2">
            <div className="h-4 w-6 bg-green-200"></div>
            <span>Zajęcia U Nauczyciela</span>
          </div>
          <div className="legend-item flex flex-row items-center gap-x-2">
            <div className="h-4 w-6 bg-red-200"></div>
            <span>Zajęcia U Studenta</span>
          </div>
        </div>
      </div>
    )
  }
}

export default CustomToolbar
