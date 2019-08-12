import React from 'react'
import { PlainObject, State } from '../type'
import { useSelector } from 'react-redux'

interface Props {
  information: PlainObject
  trueKey?: string
}

const InformationList: React.FC<Props> = props => {
  const info = props.information
  const keys = Object.keys(info)

  // Need refactor.
  // Date will be fetched from an api.
  const applyKey = useSelector((state: State) => state.panelKeys)[1]

  return (
    <table className="information-list">
      {props.trueKey === applyKey ? (
        keys.map(k => (
          <tbody key={k}>
            <tr>
              <th className="information-list-label large">{k}</th>
              <td className="information-list-value" />
            </tr>
            <tr>
              <th className="information-list-label large" />
              <td className="information-list-value">{info[k]}</td>
            </tr>
          </tbody>
        ))
      ) : (
        <tbody>
          {keys.map(k => (
            <tr key={k}>
              <th className="information-list-label">{k}</th>
              <td className="information-list-value">{info[k]}</td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  )
}

export default InformationList
