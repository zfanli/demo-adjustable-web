import React from 'react'
import { useDispatch } from 'react-redux'
import { handleSwitchModalFlag } from '../actions'

interface Props {
  name: string
}

const MenuItem: React.FC<Props> = (props: Props) => {
  const dispatch = useDispatch()

  const toggleModalFlag = () => dispatch(handleSwitchModalFlag(true))

  return <div onClick={toggleModalFlag}>{props.name}</div>
}

export default MenuItem
