import React, { CSSProperties } from 'react'
import { useDispatch } from 'react-redux'
import { animated as a } from 'react-spring'
import { handleSwitchModalFlag } from '../actions'
import MenuItem from './MenuItem'

interface Props {
  fixedMenuItems: string[]
  style: CSSProperties
}

const FixedMenu: React.FC<Props> = props => {
  const { fixedMenuItems, style } = props

  const dispatch = useDispatch()

  const handleClick = (title: string) => {
    // Put some data for modal.
    return () => dispatch(handleSwitchModalFlag(title, true))
  }

  return (
    <a.div style={style} className="normal-menu">
      {fixedMenuItems.map(f => (
        <div key={f} className="normal-menu-item">
          <MenuItem name={f} onClick={handleClick(f)} />
        </div>
      ))}
    </a.div>
  )
}

export default FixedMenu
