import React from 'react'
import MenuItem from './MenuItem'
import { useDispatch } from 'react-redux'
import { handleSwitchModalFlag } from '../actions'

interface Props {
  fixedMenuItems: string[]
}

const FixedMenu: React.FC<Props> = props => {
  const fixedMenuItems = props.fixedMenuItems

  const dispatch = useDispatch()

  const handleClick = (title: string) => {
    // Put some data for modal.
    return () => dispatch(handleSwitchModalFlag(title, true))
  }

  return (
    <div className="normal-menu">
      {fixedMenuItems.map(f => (
        <div key={f} className="normal-menu-item">
          <MenuItem name={f} onClick={handleClick(f)} />
        </div>
      ))}
    </div>
  )
}

export default FixedMenu
