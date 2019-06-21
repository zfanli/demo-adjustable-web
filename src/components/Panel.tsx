import React, { CSSProperties } from 'react'

interface Props {
  style: CSSProperties
  children: any
}

const Panel: React.FC<Props> = (props: Props) => {
  return (
    <section className="panel" style={props.style}>
      {props.children}
    </section>
  )
}

export default Panel
