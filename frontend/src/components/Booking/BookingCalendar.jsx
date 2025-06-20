import React, { useState, useEffect } from 'react'

const BookingCalendar = ({ 
  unavailableDates = [], 
  onDateSelect, 
  selectedCheckIn, 
  selectedCheckOut,
  minStay = 1 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectingCheckOut, setSelectingCheckOut] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Generate calendar days for current month
  const generateCalendarDays = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    const endDate = new Date(lastDay)
    
    // Start from Sunday of the first week
    startDate.setDate(firstDay.getDate() - firstDay.getDay())
    // End on Saturday of the last week
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()))
    
    const days = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
  }

  const isDateUnavailable = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return unavailableDates.includes(dateStr)
  }

  const isDateDisabled = (date) => {
    return date < today || isDateUnavailable(date)
  }

  const isDateInRange = (date) => {
    if (!selectedCheckIn || !selectedCheckOut) return false
    return date >= selectedCheckIn && date <= selectedCheckOut
  }

  const isDateSelected = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    const checkInStr = selectedCheckIn?.toISOString().split('T')[0]
    const checkOutStr = selectedCheckOut?.toISOString().split('T')[0]
    
    return dateStr === checkInStr || dateStr === checkOutStr
  }

  const handleDateClick = (date) => {
    if (isDateDisabled(date)) return

    if (!selectedCheckIn || (selectedCheckIn && selectedCheckOut)) {
      // First click or reset
      onDateSelect({ checkIn: date, checkOut: null })
      setSelectingCheckOut(true)
    } else if (selectingCheckOut) {
      // Second click - selecting checkout
      if (date <= selectedCheckIn) {
        // If clicked date is before or same as check-in, reset
        onDateSelect({ checkIn: date, checkOut: null })
      } else {
        // Valid checkout date
        onDateSelect({ checkIn: selectedCheckIn, checkOut: date })
        setSelectingCheckOut(false)
      }
    }
  }

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(currentMonth.getMonth() + direction)
    setCurrentMonth(newMonth)
  }

  const calendarDays = generateCalendarDays(currentMonth)
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
          const isDisabled = isDateDisabled(date)
          const isSelected = isDateSelected(date)
          const isInRange = isDateInRange(date)
          const isToday = date.toDateString() === today.toDateString()

          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              type="button"
              className={`
                relative p-2 text-sm rounded-md transition-colors
                ${!isCurrentMonth ? 'text-gray-300' : ''}
                ${isDisabled 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'hover:bg-gray-100 cursor-pointer'
                }
                ${isSelected 
                  ? 'bg-primary-600 text-white hover:bg-primary-700' 
                  : ''
                }
                ${isInRange && !isSelected 
                  ? 'bg-primary-100 text-primary-800' 
                  : ''
                }
                ${isToday && !isSelected 
                  ? 'ring-2 ring-primary-500' 
                  : ''
                }
              `}
            >
              {date.getDate()}
              
              {/* Unavailable indicator */}
              {isDateUnavailable(date) && (
                <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 transform -rotate-45"></div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary-600 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-primary-100 rounded"></div>
          <span>In range</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gray-300 rounded relative">
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 transform -rotate-45"></div>
          </div>
          <span>Unavailable</span>
        </div>
      </div>

      {/* Selected dates display */}
      {(selectedCheckIn || selectedCheckOut) && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <div className="text-sm">
            <div className="flex justify-between items-center">
              <span className="font-medium">Check-in:</span>
              <span>{selectedCheckIn ? selectedCheckIn.toLocaleDateString() : 'Select date'}</span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="font-medium">Check-out:</span>
              <span>{selectedCheckOut ? selectedCheckOut.toLocaleDateString() : 'Select date'}</span>
            </div>
            {selectedCheckIn && selectedCheckOut && (
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <span className="font-medium">Nights:</span>
                <span className="font-semibold">
                  {Math.ceil((selectedCheckOut - selectedCheckIn) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default BookingCalendar 