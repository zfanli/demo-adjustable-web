import React from 'react'
import { useSelector } from 'react-redux'
import { State } from '../type'
import MenuItem from './MenuItem'

const FixedMenu: React.FC = () => {
  const fixedMenuItems = useSelector(
    (state: State) => state.settings.locale.fixedMenu
  ) as string[]

  return (
    <div className="normal-menu">
      {fixedMenuItems.map(f => (
        <MenuItem key={f} name={f} style={{}} />
      ))}
    </div>
  )
}

export default FixedMenu
