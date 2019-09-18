import React from 'react'
import { Reply } from '../type'

interface Props {
  list: Reply[]
  userId: string
  name: string
}

function formatTime(time: string) {
  return `${time.slice(0, 2)}:${time.slice(2)}`
}

function formatDate(date: string) {
  return `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(6)}`
}

const ReplyInformationAuto: React.FC<Props> = props => {
  const { list, userId, name } = props

  return (
    <div className="reply-auto">
      <table className="reply-auto-header">
        <colgroup>
          <col width="50%" />
          <col width="50%" />
        </colgroup>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{userId}</td>
            <td>{name}</td>
          </tr>
        </tbody>
      </table>

      <table className="reply-auto-body">
        <colgroup>
          <col width="80" />
          <col />
        </colgroup>
        <thead>
          <tr>
            <th>Datetime</th>
            <th>Business</th>
          </tr>
        </thead>
        <tbody>
          {list.map((line, i) => (
            <tr key={i}>
              <td>
                {formatDate(line.timestamp.slice(0, 8))}
                <br />
                {formatTime(line.timestamp.slice(8))}
              </td>
              <td
                dangerouslySetInnerHTML={{
                  __html: line.information.split('\n').join('<br>'),
                }}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ReplyInformationAuto
