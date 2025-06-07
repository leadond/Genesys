import { useState } from 'react'
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import styled from 'styled-components'

const DateRangePicker = ({ startDate, endDate, onChange, presets = true }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }
  
  const applyPreset = (days) => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - days)
    onChange(start, end)
    setIsOpen(false)
  }
  
  const handleDayClick = (day) => {
    // Simple implementation - first click sets start date, second click sets end date
    if (!startDate || (startDate && endDate)) {
      const newStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      onChange(newStart, newStart)
    } else {
      const newEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      // Ensure end date is not before start date
      if (newEnd >= startDate) {
        onChange(startDate, newEnd)
      } else {
        onChange(newEnd, startDate)
      }
      setIsOpen(false)
    }
  }
  
  const prevMonth = () => {
    const prev = new Date(currentMonth)
    prev.setMonth(prev.getMonth() - 1)
    setCurrentMonth(prev)
  }
  
  const nextMonth = () => {
    const next = new Date(currentMonth)
    next.setMonth(next.getMonth() + 1)
    setCurrentMonth(next)
  }
  
  const renderCalendar = () => {
    const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
    
    const days = []
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<DayCell key={`empty-${i}`} empty />)
    }
    
    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const isToday = new Date().toDateString() === date.toDateString()
      
      // Check if this day is selected or in range
      const isStart = startDate && date.toDateString() === startDate.toDateString()
      const isEnd = endDate && date.toDateString() === endDate.toDateString()
      const isInRange = startDate && endDate && 
                        date > startDate && 
                        date < endDate
      
      days.push(
        <DayCell 
          key={day}
          onClick={() => handleDayClick(day)}
          isToday={isToday}
          isStart={isStart}
          isEnd={isEnd}
          isInRange={isInRange}
        >
          {day}
        </DayCell>
      )
    }
    
    return (
      <CalendarContainer>
        <CalendarHeader>
          <MonthNavButton onClick={prevMonth}>
            <FaChevronLeft />
          </MonthNavButton>
          <MonthTitle>{monthName}</MonthTitle>
          <MonthNavButton onClick={nextMonth}>
            <FaChevronRight />
          </MonthNavButton>
        </CalendarHeader>
        
        <CalendarGrid>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <DayHeader key={day}>{day}</DayHeader>
          ))}
          {days}
        </CalendarGrid>
        
        <CalendarFooter>
          <ApplyButton onClick={() => setIsOpen(false)}>Apply</ApplyButton>
        </CalendarFooter>
      </CalendarContainer>
    )
  }
  
  return (
    <DateRangePickerContainer>
      <DatePickerInput onClick={() => setIsOpen(!isOpen)}>
        <FaCalendarAlt className="calendar-icon" />
        <span>
          {startDate && endDate ? 
            `${formatDate(startDate)} - ${formatDate(endDate)}` : 
            'Select date range'}
        </span>
      </DatePickerInput>
      
      {presets && (
        <DatePresets>
          <PresetButton onClick={() => applyPreset(7)}>Last 7 days</PresetButton>
          <PresetButton onClick={() => applyPreset(30)}>Last 30 days</PresetButton>
          <PresetButton onClick={() => applyPreset(90)}>Last 90 days</PresetButton>
        </DatePresets>
      )}
      
      {isOpen && (
        <DatePickerPopup>
          {renderCalendar()}
        </DatePickerPopup>
      )}
    </DateRangePickerContainer>
  )
}

const DateRangePickerContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
`

const DatePickerInput = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  background-color: var(--bg-primary);
  
  .calendar-icon {
    margin-right: 0.5rem;
    color: var(--md-red);
  }
`

const DatePresets = styled.div`
  display: flex;
  margin-top: 0.5rem;
  gap: 0.5rem;
`

const PresetButton = styled.button`
  background: none;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background-color: var(--bg-secondary);
  }
`

const DatePickerPopup = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 10;
  margin-top: 0.5rem;
  background-color: var(--bg-primary);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
`

const CalendarContainer = styled.div`
  width: 280px;
  padding: 1rem;
`

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const MonthTitle = styled.div`
  font-weight: 500;
`

const MonthNavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  
  &:hover {
    background-color: var(--bg-secondary);
    color: var(--md-red);
  }
`

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`

const DayHeader = styled.div`
  text-align: center;
  font-size: 0.8rem;
  font-weight: 500;
  padding: 0.5rem 0;
  color: var(--text-secondary);
`

const DayCell = styled.div`
  text-align: center;
  padding: 0.5rem 0;
  cursor: ${props => props.empty ? 'default' : 'pointer'};
  border-radius: 50%;
  
  background-color: ${props => 
    props.isToday ? 'var(--md-red)' : 
    props.isStart || props.isEnd ? 'var(--md-red)' : 
    props.isInRange ? 'rgba(229, 0, 0, 0.1)' : 
    'transparent'};
  
  color: ${props => 
    (props.isToday || props.isStart || props.isEnd) ? 'white' : 
    props.empty ? 'transparent' :
    'var(--text-primary)'};
  
  &:hover {
    background-color: ${props => 
      props.empty ? 'transparent' :
      (props.isToday || props.isStart || props.isEnd) ? 'var(--md-dark-red)' : 
      'var(--bg-secondary)'};
  }
`

const CalendarFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`

const ApplyButton = styled.button`
  background-color: var(--md-red);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: var(--md-dark-red);
  }
`

export default DateRangePicker
