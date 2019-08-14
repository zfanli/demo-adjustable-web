import React from 'react'
import { UserInformation as UserInformationType } from '../type'

interface Props {
  userInformation: UserInformationType
}

const UserInformation: React.FC<Props> = props => {
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
            <th>カナ氏名</th>
            <td className="center">{nameKn}</td>
            <th>チーム</th>
            <td className="center">{team}</td>
          </tr>
          <tr>
            <th>漢字氏名</th>
            <td className="center" colSpan={3}>
              {name}
            </td>
          </tr>
          <tr>
            <th>会員番号</th>
            <td className="center">{userId}</td>
            <th>性別</th>
            <td className="center">{gender}</td>
          </tr>
          <tr>
            <th>生年月日</th>
            <td className="center">{birthday}</td>
            <th>年齢</th>
            <td className="center">{age}</td>
          </tr>
          <tr className="special-start">
            <th colSpan={4}>利用限度額・利率変更</th>
          </tr>
          <tr>
            <th colSpan={2}>希望利用限度額</th>
            <td colSpan={2}>
              <input
                className="inline-input amount"
                readOnly // for now
                value={loanLimit}
              />
              万円
            </td>
          </tr>
          <tr>
            <th colSpan={2}>契約上限額</th>
            <td colSpan={2}>
              <input
                className="inline-input amount"
                disabled
                value={contractLimit}
              />
              万円
            </td>
          </tr>
          <tr>
            <th colSpan={2}>書類受領時契約上限額</th>
            <td colSpan={2}>
              <input
                className="inline-input amount"
                disabled
                value={firstLoanLimit}
              />
              万円
            </td>
          </tr>
          <tr className="special-end">
            <th colSpan={2}>総量上限額</th>
            <td colSpan={2}>
              <input
                className="inline-input amount"
                disabled
                value={totalLimit}
              />
              万円
            </td>
          </tr>
          <tr>
            <th colSpan={2}>年収</th>
            <td colSpan={2}>
              <input
                className="inline-input amount"
                readOnly // for now
                value={annualIncome}
              />
              万円
            </td>
          </tr>
          <tr>
            <th colSpan={2}>勤務状況確認区分</th>
            <td colSpan={2}>
              <select name="jobType" id="jobType" defaultValue={jobTypeCode}>
                <option value={jobTypeCode}>{jobType}</option>
              </select>
            </td>
          </tr>
          <tr>
            <th colSpan={2}>支払方式</th>
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
            <th colSpan={2}>利用目的</th>
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
