import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Icon, Menu, Dropdown, Switch } from 'antd'
import { ClickParam } from 'antd/lib/menu'
import { State } from '../type'
import { setLocale, setSortable, resetPanelsPosition } from '../actions'

const Header: React.FC = () => {
  // get header string from store
  const header = useSelector((state: State) => state.locale.header)
  const height = useSelector((state: State) => state.headerHeight)
  const dispatch = useDispatch()

  const handleI18nMenuClick = (e: ClickParam) => {
    dispatch(setLocale(e.key))
  }

  const [settingsVisible, setSettingsVisible] = useState(false)

  const sortableText = useSelector((state: State) => state.locale.sortable)
  const resetText = useSelector((state: State) => state.locale.resetPosition)

  const handleSettingsVisibleChange = (flag: boolean) => {
    setSettingsVisible(flag)
  }

  const handleSortableSwitchChange = (checked: boolean) => {
    dispatch(setSortable(checked))
  }

  const handleResetPosition = () => {
    setSettingsVisible(false)
    dispatch(resetPanelsPosition())
  }

  return (
    <header className="header" style={{ height }}>
      <div className="header-title">{header}</div>
      <div className="header-buttons">
        <Dropdown
          overlay={
            <Menu onClick={handleI18nMenuClick}>
              <Menu.Item key="jp">JP</Menu.Item>
              <Menu.Item key="en">EN</Menu.Item>
            </Menu>
          }
          trigger={['click']}
        >
          <button>
            <Icon type="global" />
          </button>
        </Dropdown>
        <Dropdown
          overlay={
            <Menu>
              <Menu.Item key="1">
                <label className="sortable-switch">
                  {sortableText}
                  <Switch
                    defaultChecked
                    onChange={handleSortableSwitchChange}
                  />
                </label>
              </Menu.Item>
              <Menu.Item onClick={handleResetPosition}>
                <Icon type="appstore" />
                {resetText}
              </Menu.Item>
            </Menu>
          }
          trigger={['click']}
          visible={settingsVisible}
          onVisibleChange={handleSettingsVisibleChange}
        >
          <button>
            <Icon type="setting" />
          </button>
        </Dropdown>
      </div>
    </header>
  )
}

export default Header
