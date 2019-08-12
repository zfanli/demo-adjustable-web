import React from 'react'

interface Props {
  name: string
  onClick: () => void
}

const MenuItem: React.FC<Props> = props => {
  const { name, onClick } = props

  return <div onClick={onClick}>{name}</div>
}

export default MenuItem
