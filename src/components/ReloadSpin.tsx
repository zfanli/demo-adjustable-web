import React from 'react'
import { Spin } from 'antd'

interface Props {
  spinning: boolean
}

const ReloadSpin: React.FC<Props> = props => {
  const { spinning } = props

  if (!spinning) return null

  return (
    <div className="reloading">
      <Spin className="spin" size="large" />
      <div className="mask" />
    </div>
  )
}

export default ReloadSpin
