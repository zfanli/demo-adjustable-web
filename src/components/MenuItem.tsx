import React from 'react'
import { AnimatedValue, animated as a } from 'react-spring'

interface Props {
  name: string
  style: AnimatedValue<any>
}

const MenuItem: React.FC<Props> = (props: Props) => {
  return (
    <a.div style={props.style} className="normal-menu-item">
      {props.name}
    </a.div>
  )
}

export default MenuItem
