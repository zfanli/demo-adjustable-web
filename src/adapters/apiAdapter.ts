import { UserInformation, Reply, ReplyInput } from '../type'

export function userInformationAdapter(data: any): UserInformation {
  return {
    userId: data.systemId,
    nameKn: data.userNamekn,
    name: data.userName,
    birthday: data.birthday,
    genderCode: data.seibetsuCd,
    gender: data.seibetsuCdStr,
    age: data.userAge,
    team: data.jmsTeamCode,
    loanLimit: data.loanAmount,
    contractLimit: data.creditAmount,
    firstLoanLimit: data.firstLoanAmount,
    totalLimit: data.largeAmount,
    annualIncome: data.collateralLoanAmount,
    jobTypeCode: data.coJobTypeCd,
    jobType: data.coJobTypeCdStr,
    repaymentCode: data.repaymentCd,
    repayment: data.repaymentCdStr,
    purposeCode: data.usingPurpose,
    purpose: data.usingPurposeStr,
  }
}

export function replyAutoInformationAdapter(data: any): Reply[] {
  return data
    .map((d: { cotDatetime: any; cotInfo: any }) => ({
      timestamp: d.cotDatetime,
      information: d.cotInfo,
    }))
    .sort((a: Reply, b: Reply) => b.timestamp.localeCompare(a.timestamp))
}

export function replyInputInformationAdapter(data: any): ReplyInput[] {
  return data
    .map(
      (d: {
        inputYmd: any
        inputHm: any
        cotStatus: any
        hassinSaki: any
        kaisenJoutai: any
        tsuuwaAite: any
        tanntouUser: any
        teamName: any
        cotTitle1: any
        cotInfo1: any
        cotResult1: any
        cotMemo1: any
      }) => ({
        date: d.inputYmd,
        time: d.inputHm,
        dealing: d.cotStatus,
        contact: d.hassinSaki,
        circuit: d.kaisenJoutai,
        target: d.tsuuwaAite,
        staff: d.tanntouUser,
        team: d.teamName,
        business: d.cotTitle1,
        result: d.cotResult1,
        detail: d.cotInfo1,
        information: d.cotMemo1,
      })
    )
    .sort((a: ReplyInput, b: ReplyInput) =>
      ('' + b.date + b.time).localeCompare('' + a.date + a.time)
    )
}
