import React, { useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Panel from '../components/Panel'

import '../css/adjustableView.scss'

const AdjustableView: React.FC = () => {
  const panelConfig = new Array(5).fill(0)

  const av = useRef(null)

  return (
    <>
      <Header />
      <div className="av-content">
        {panelConfig.map(() => (
          <Panel />
        ))}
      </div>
      <Footer />
    </>
  )
}

export default AdjustableView
