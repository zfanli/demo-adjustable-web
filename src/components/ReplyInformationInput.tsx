import React from 'react'
import { ReplyInput } from '../type'
import { Button } from 'antd'
import { useDispatch } from 'react-redux'
import { handleSaveInputReply } from '../actions'

interface Props {
  list: ReplyInput[]
  input: ReplyInput
}

function formatTime(time: string) {
  return `${time.slice(0, 2)}:${time.slice(2)}`
}

function formatDate(date: string) {
  return `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(6)}`
}

const ReplyInformationInput: React.FC<Props> = props => {
  const { list, input } = props

  const date = new Date()
  const dispatch = useDispatch()

  const handleChange = (name: string) => (e: any) =>
    dispatch(handleSaveInputReply({ ...input, [name]: e.target.value }))

  const handleReset = () => {
    Object.keys(input).forEach(k => ((input as any)[k] = ''))
    dispatch(handleSaveInputReply(input))
  }

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
              {formatDate(
                date.getFullYear() +
                  String(date.getMonth() + 1).padStart(2, '0') +
                  String(date.getDate()).padStart(2, '0')
              )}
            </td>
            <td>
              {formatTime(
                String(date.getHours()).padStart(2, '0') +
                  String(date.getMinutes()).padStart(2, '0')
              )}
            </td>
            <td>
              <input
                className="inline-input"
                value={input.dealing}
                onChange={handleChange('dealing')}
              />
            </td>
          </tr>
          <tr>
            <th>架電先</th>
            <th>回線</th>
            <th>相手</th>
          </tr>
          <tr>
            <td>
              <input
                className="inline-input"
                value={input.contact}
                onChange={handleChange('contact')}
              />
            </td>
            <td>
              <input
                className="inline-input"
                value={input.circuit}
                onChange={handleChange('circuit')}
              />
            </td>
            <td>
              <input
                className="inline-input"
                value={input.target}
                onChange={handleChange('target')}
              />
            </td>
          </tr>
          <tr>
            <th>担当者</th>
            <td colSpan={2}>
              <input
                className="inline-input"
                value={input.staff}
                onChange={handleChange('staff')}
              />
            </td>
          </tr>
          <tr>
            <th>チーム</th>
            <td colSpan={2}>
              <input
                className="inline-input"
                value={input.team}
                onChange={handleChange('team')}
              />
            </td>
          </tr>
          <tr>
            <th>用件</th>
            <td colSpan={2}>
              <input
                className="inline-input"
                value={input.business}
                onChange={handleChange('business')}
              />
            </td>
          </tr>
          <tr>
            <th>結果</th>
            <td colSpan={2}>
              <input
                className="inline-input"
                value={input.result}
                onChange={handleChange('result')}
              />
            </td>
          </tr>
          <tr>
            <th>詳細・受付</th>
            <td colSpan={2}>
              <input
                className="inline-input"
                value={input.detail}
                onChange={handleChange('detail')}
              />
            </td>
          </tr>
          <tr>
            <td colSpan={3}>
              <input
                className="inline-input"
                value={input.information}
                onChange={handleChange('information')}
              />
            </td>
          </tr>
          <tr>
            <td className="reply-input-buttons" colSpan={3}>
              <Button type="primary" size="small">
                確認
              </Button>
              <Button size="small" onClick={handleReset}>
                リセット
              </Button>
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
              <td>{formatDate(line.date)}</td>
              <td>{formatTime(line.time)}</td>
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
