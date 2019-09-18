import React from 'react'
import { UserInformation as UserInformationType } from '../type'

interface Props {
  userInformation?: UserInformationType
}

function formatDate(date: string) {
  return `${date.slice(0, 4)}/${date.slice(4, 6)}/${date.slice(6)}`
}

const UserInformation: React.FC<Props> = props => {
  // Do nothing if user information does not exist.
  if (!props.userInformation) {
    return null
  }

  const {
    userId,
    nameKn,
    team,
    name,
    gender,
    age,
    birthday,
    loanLimit,
    contractLimit,
    firstLoanLimit,
    totalLimit,
    annualIncome,
    jobType,
    jobTypeCode,
    repayment,
    repaymentCode,
    purpose,
    purposeCode,
  } = props.userInformation

  return (
    <div className="user-information">
      <table className="user-information-body">
        <colgroup>
          <col width="25%" />
          <col width="25%" />
          <col width="25%" />
          <col width="25%" />
        </colgroup>
        <tbody>
          <tr>
            <th>Name KN</th>
            <td className="center">{nameKn}</td>
            <th>Team</th>
            <td className="center">{team}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td className="center" colSpan={3}>
              {name}
            </td>
          </tr>
          <tr>
            <th>User ID</th>
            <td className="center">{userId}</td>
            <th>Gender</th>
            <td className="center">{gender}</td>
          </tr>
          <tr>
            <th>Birthday</th>
            <td className="center">{formatDate(birthday)}</td>
            <th>Age</th>
            <td className="center">{age}</td>
          </tr>
          <tr className="special-start">
            <th colSpan={4}>Information1</th>
          </tr>
          <tr>
            <th colSpan={2}>Information2</th>
            <td colSpan={2}>
              <input
                className="inline-input amount"
                readOnly // for now
                value={loanLimit}
              />
              M
            </td>
          </tr>
          <tr>
            <th colSpan={2}>Information3</th>
            <td colSpan={2}>
              <input
                className="inline-input amount"
                disabled
                value={contractLimit}
              />
              M
            </td>
          </tr>
          <tr>
            <th colSpan={2}>Information4</th>
            <td colSpan={2}>
              <input
                className="inline-input amount"
                disabled
                value={firstLoanLimit}
              />
              M
            </td>
          </tr>
          <tr className="special-end">
            <th colSpan={2}>Information5</th>
            <td colSpan={2}>
              <input
                className="inline-input amount"
                disabled
                value={totalLimit}
              />
              M
            </td>
          </tr>
          <tr>
            <th colSpan={2}>Information6</th>
            <td colSpan={2}>
              <input
                className="inline-input amount"
                readOnly // for now
                value={annualIncome}
              />
              M
            </td>
          </tr>
          <tr>
            <th colSpan={2}>Information7</th>
            <td colSpan={2}>
              <select name="jobType" id="jobType" defaultValue={jobTypeCode}>
                <option value={jobTypeCode}>{jobType}</option>
              </select>
            </td>
          </tr>
          <tr>
            <th colSpan={2}>Information8</th>
            <td colSpan={2}>
              <select
                name="repayment"
                id="repayment"
                defaultValue={repaymentCode}
              >
                <option value={repaymentCode}>{repayment}</option>
              </select>
            </td>
          </tr>
          <tr>
            <th colSpan={2}>Information9</th>
            <td colSpan={2}>
              <select name="purpose" id="purpose" defaultValue={purposeCode}>
                <option value={purposeCode}>{purpose}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default UserInformation
