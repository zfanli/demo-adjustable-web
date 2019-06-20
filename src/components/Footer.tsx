import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../type'

const Footer: React.FC = () => {
  // get footer string from store
  const footer = useSelector((state: State) => state.locale.footer)
  return <footer className="footer">{footer}</footer>
}

export default Footer
