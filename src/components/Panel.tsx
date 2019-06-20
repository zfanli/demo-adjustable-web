import React, { CSSProperties } from 'react'

interface Props {
  style: CSSProperties
}

const Panel: React.FC<Props> = (props: Props) => {
  return (
    <section className="panel" style={props.style}>
      Panel
    </section>
  )
}

export default Panel
