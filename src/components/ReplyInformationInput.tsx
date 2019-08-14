import React from 'react'
import { ReplyInput } from '../type'

interface Props {
  list: ReplyInput[]
}

const ReplyInformationInput: React.FC<Props> = props => {
  const { list } = props

  const date = new Date()

  return (
    <div className="reply-input">
      <table className="reply-input-body">
        <colgroup>
          <col width="33%" />
          <col width="33%" />
          <col width="33%" />
        </colgroup>
        <tbody>
          <tr>
            <th className="bold" colSpan={3}>
              手入力
            </th>
          </tr>
          <tr>
            <th>日付</th>
            <th>時間</th>
            <th>処理</th>
          </tr>
          <tr>
            <td>
              {`${date.getFullYear()}${String(date.getMonth() + 1).padStart(
                2,
                '0'
              )}${String(date.getDate()).padStart(2, '0')}`}
            </td>
            <td>
              {`${String(date.getHours()).padStart(2, '0')}${String(
                date.getMinutes()
              ).padStart(2, '0')}`}
            </td>
            <td>
              <input className="inline-input" defaultValue="架電" />
            </td>
          </tr>
          <tr>
            <th>架電先</th>
            <th>回線</th>
            <th>相手</th>
          </tr>
          <tr>
            <td>
              <input className="inline-input" defaultValue="携帯電話" />
            </td>
            <td>
              <input className="inline-input" defaultValue="正常" />
            </td>
            <td>
              <input className="inline-input" defaultValue="本人" />
            </td>
          </tr>
          <tr>
            <th>担当者</th>
            <td colSpan={2}>
              <input className="inline-input" defaultValue="M05013 担当者13" />
            </td>
          </tr>
          <tr>
            <th>チーム</th>
            <td colSpan={2}>
              <input className="inline-input" defaultValue="営業システム部" />
            </td>
          </tr>
          <tr>
            <th>用件</th>
            <td colSpan={2}>
              <input className="inline-input" defaultValue="架電反応13" />
            </td>
          </tr>
          <tr>
            <th>結果</th>
            <td colSpan={2}>
              <input className="inline-input" defaultValue="正常3" />
            </td>
          </tr>
          <tr>
            <th>詳細・受付</th>
            <td colSpan={2}>
              <input className="inline-input" defaultValue="詳細・受付" />
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <input className="inline-input" defaultValue="契約額変更3" />
            </td>
          </tr>
        </tbody>

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
