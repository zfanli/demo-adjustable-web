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
        <div key={f} className="normal-menu-item">
          <MenuItem name={f} />
        </div>
      ))}
    </div>
  )
}

export default FixedMenu
