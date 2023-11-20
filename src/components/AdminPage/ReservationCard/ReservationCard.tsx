import CalendarIcon from '@/components/Common/Icon/CalendarIcon'
import PencilIcon from '@/components/Common/Icon/PencilIcon'
import dayjs, { Dayjs } from 'dayjs'
export default function ReservationCard({
  date,
  res_list,
  onDelete,
  onEdit,
  onFocus,
}: {
  date: string
  res_list: any[]
  onDelete: () => void
  onEdit: () => void
  onFocus: Function
}) {
  const getDayOfWeek = (date: string): string => {
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    const dayIndex = new Date(date).getDay()
    return daysOfWeek[dayIndex]
  }
  const dayColor: Record<string, string> = {
    SUN: 'bg-red-600',
    MON: 'bg-yellow-400',
    TUE: 'bg-pink-400',
    WED: 'bg-green-400',
    THU: 'bg-orange-400',
    FRI: 'bg-sky-400',
    SAT: 'bg-purple-400',
  }
  const dayOfWeek = getDayOfWeek(date)
  const headerLine = () => {
    return (
      <thead>
        <tr>
          <th className=" flex items-center justify-center text-center">
            <div className=" w-fit bg-sky-400 rounded-full text-center text-white text-base px-2">
              Name
            </div>
          </th>
          <th className="  w-fit text-center text-sky-500 text-base font-bold">
            Tel
          </th>
          <th className="w-fit text-center text-sky-500 text-base font-bold">
            Number of Guests
          </th>
          <th className="w-fit text-center text-sky-500 text-base font-bold">
            Created At
          </th>
        </tr>
      </thead>
    )
  }

  const eachRow = (res: object) => {
    return (
      <tr>
        <td>{res.name}</td>
        <td className="text-center">{res.tel}</td>
        <td className="text-center">{res.participants}</td>
        <td className="text-center">{res.createdAt}</td>
        <td>
          <div className="flex flex-row space-x-8 justify-center items-center">
            <div className="px-4 bg-red-500 rounded-full justify-start items-center inline-flex hover:bg-red-600">
              <div
                className="text-center text-white text-xs font-bold font-['Helvetica Neue'] leading-[18px]"
                onClick={() => {
                  onFocus(res)
                  onDelete()
                }}
              >
                Delete
              </div>
            </div>
            <button
              onClick={() => {
                onFocus(res)
                onEdit()
              }}
            >
              <PencilIcon />
            </button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row justify-start items-center space-x-2">
        <CalendarIcon />
        <div
          className={
            'w-fit px-2 relative rounded-[30px] text-white text-lg font-bold ' +
            dayColor[dayOfWeek]
          }
        >
          {dayOfWeek}
        </div>
        <div className="text-black text-base font-normal font-['Helvetica Neue'] leading-normal">
          {dayjs(date).format('MMM D, YYYY')}
        </div>
      </div>
      <div className="w-fit bg-zinc-100 rounded-xl p-3">
        <table className="table-auto border-separate border-spacing-x-10">
          {headerLine()}
          <tbody>{res_list.map((res: object) => eachRow(res))}</tbody>
        </table>
      </div>
    </div>
  )
}
