import React from 'react'
import { PlainObject } from '../type'

interface Props {
  information: PlainObject
}

const InformationList: React.FC<Props> = (props: Props) => {
  const info = props.information
  const keys = Object.keys(info)
  return (
    <table className="information-list">
      <tbody>
        {keys.map(k => (
          <tr key={k}>
            <th className="information-list-label">{k}</th>
            <td className="information-list-value">{info[k]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default InformationList
