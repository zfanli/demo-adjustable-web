import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../type'

const Footer: React.FC = () => {
  // get footer string from store
  const footer = useSelector((state: State) => state.settings.locale.footer)
  const height = useSelector((state: State) => state.settings.footerHeight)
  return (
    <footer className="footer" style={{ height }}>
      {footer}
    </footer>
  )
}

export default Footer
