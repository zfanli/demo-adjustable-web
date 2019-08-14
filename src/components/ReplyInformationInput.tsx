import React from 'react'
import { ReplyInput } from '../type'

interface Props {
  list: ReplyInput[]
}

const ReplyInformationInput: React.FC<Props> = props => {
  const { list } = props

  return (
    <div className="reply-input">
      <table className="reply-input-body">
        <colgroup>
          <col width="33%" />
          <col width="33%" />
          <col width="33%" />
        </colgroup>
        {list.map((line, i) => (
          <tbody key={i}>
            <tr>
              <th className="bold" colSpan={3}>
                履歴 No.{i + 1}
              </th>
            </tr>
            <tr>
              <th>日付</th>
              <th>時間</th>
              <th>処理</th>
            </tr>
            <tr>
              <td>{line.date}</td>
              <td>{line.time}</td>
              <td>{line.dealing}</td>
            </tr>
            <tr>
              <th>架電先</th>
              <th>回線</th>
              <th>相手</th>
            </tr>
            <tr>
              <td>{line.contact}</td>
              <td>{line.circuit}</td>
              <td>{line.target}</td>
            </tr>
            <tr>
              <th>担当者</th>
              <td colSpan={2}>{line.staff}</td>
            </tr>
            <tr>
              <th>チーム</th>
              <td colSpan={2}>{line.team}</td>
            </tr>
            <tr>
              <th>用件</th>
              <td colSpan={2}>{line.business}</td>
            </tr>
            <tr>
              <th>結果</th>
              <td colSpan={2}>{line.result}</td>
            </tr>
            <tr>
              <th>詳細・受付</th>
              <td colSpan={2}>{line.detail}</td>
            </tr>
            <tr>
              <td colSpan={3}>{line.information}</td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  )
}

export default ReplyInformationInput
