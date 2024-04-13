import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { months } from '@/constants/months'
import { Calendar, CalendarProps } from '../ui/calendar'
import { useCallback, useEffect, useState } from 'react'
import { getDaysInMonth } from 'date-fns'
import { isMatch } from 'react-day-picker'

export default function CustomCalendar ({
  onDateSelect,
  fieldValue
}: {
  onDateSelect: (date: Date | string) => void
  fieldValue: string
}) {
  const [dateObject, setDateObject] = useState({
    month: new Date(fieldValue || new Date()).getMonth() + 1,
    year: new Date(fieldValue || new Date()).getFullYear(),
    readable: false
  })

  useEffect(() => {
    if (fieldValue) {
      setDateObject(prev => {
        if (
          prev.month === new Date(fieldValue).getMonth() + 1 &&
          prev.year === new Date(fieldValue).getFullYear()
        ) {
          return prev
        }
        return {
          ...prev,
          month: new Date(fieldValue).getMonth() + 1,
          year: new Date(fieldValue).getFullYear()
        }
      })
    }
  }, [fieldValue])
  return (
    <>
      <div className='w-full grid grid-cols-2 gap-3 px-4 mb-5'>
        <Select
          onValueChange={e =>
            setDateObject({ ...dateObject, month: parseInt(e) })
          }
          value={dateObject.month.toString()}
        >
          <SelectTrigger>
            <SelectValue className='w-full' placeholder='Month' />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, month_idx) => (
              <SelectItem key={month_idx} value={month.value.toString()}>
                {month.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={e =>
            setDateObject({ ...dateObject, year: parseInt(e) })
          }
          value={dateObject.year.toString()}
        >
          <SelectTrigger>
            <SelectValue className='w-full' placeholder='Year' />
          </SelectTrigger>
          <SelectContent>
            {Array.from(
              { length: new Date().getFullYear() - 1900 + 1 },
              (_, i) => 1900 + i
            ).map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Calendar
        disabled={date => date > new Date() || date < new Date('1900-01-01')}
        mode='single'
        onMonthChange={e => {
          setDateObject({
            ...dateObject,
            month: new Date(e).getMonth() + 1,
            year: new Date(e).getFullYear(),
            readable: false
          })
        }}
        month={
          new Date(`${dateObject.month}/01/${dateObject.year}`).getTime()
            ? new Date(`${dateObject.month}/01/${dateObject.year}`)
            : new Date()
        }
        selected={new Date(fieldValue)}
        onSelect={e => onDateSelect(e || '')}
      />
    </>
  )
}
