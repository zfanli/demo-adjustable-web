import React from 'react'

interface Props {
  list: { [k: string]: string }[]
  userId: string
  name: string
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
            <th>会員番号</th>
            <th>氏名</th>
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
            <th>日時</th>
            <th>用件</th>
          </tr>
        </thead>
        <tbody>
          {list.map((line, i) => (
            <tr key={i}>
              <td>{line.cotDatetime}</td>
              <td>{line.cotInfo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ReplyInformationAuto
