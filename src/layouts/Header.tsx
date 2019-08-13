import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Icon, Menu, Dropdown, Switch, Radio, Tooltip } from 'antd'
import { ClickParam } from 'antd/lib/menu'
import { State } from '../type'
import {
  handleSwitchLocale,
  handleSwitchSortable,
  handlePanelReset,
  handleSwitchMessageFlag,
  handleSwitchSstFlag,
  handleSwitchUser,
} from '../actions'

const Header: React.FC = () => {
  // get header string from store
  const header = useSelector((state: State) => state.settings.locale.header)
  const height = useSelector((state: State) => state.settings.headerHeight)
  const sstFlag = useSelector((state: State) => state.settings.sstFlag)
  const dispatch = useDispatch()

  const handleI18nMenuClick = (e: ClickParam) => {
    dispatch(handleSwitchLocale(e.key))
  }

  const handleSwitchUserClick = (e: ClickParam) => {
    dispatch(handleSwitchUser(Number(e.key)))
  }

  const [settingsVisible, setSettingsVisible] = useState(false)

  const resetText = useSelector(
    (state: State) => state.settings.locale.resetPosition
  )

  const locale = useSelector((state: State) => state.settings.locale)

  const handleSettingsVisibleChange = (flag: boolean) => {
    setSettingsVisible(flag)
  }

  const handleSortableSwitchChange = (checked: boolean) => {
    dispatch(handleSwitchSortable(checked))
  }

  const handleMessageSwitchChange = (checked: boolean) => {
    dispatch(handleSwitchMessageFlag(checked))
  }

  const handleSstSwitchChange = (e: any) => {
    dispatch(handleSwitchSstFlag(e.target.value))
  }

  const handleResetPosition = () => {
    setSettingsVisible(false)
    dispatch(handlePanelReset())
  }

  const radioStyle = {
    display: 'block',
  }

  return (
    <header className="header" style={{ height }}>
      <div className="header-title">{header}</div>
      <div className="header-buttons">
        <Tooltip
          title={locale.switchUser}
          placement="left"
          overlayClassName="tooltip"
          mouseLeaveDelay={0.05}
        >
          <Dropdown
            overlay={
              <Menu onClick={handleSwitchUserClick}>
                <Menu.Item key="0">会員ID:100001</Menu.Item>
                <Menu.Item key="1">会員ID:100002</Menu.Item>
                <Menu.Item key="2">会員ID:100003</Menu.Item>
              </Menu>
            }
            trigger={['click']}
          >
            <button>
              <Icon type="team" />
            </button>
          </Dropdown>
        </Tooltip>

        <Tooltip
          title={locale.language}
          placement="left"
          overlayClassName="tooltip"
          mouseLeaveDelay={0.05}
        >
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
        </Tooltip>

        <Tooltip
          title={locale.settings}
          placement="left"
          overlayClassName="tooltip"
          mouseLeaveDelay={0.05}
        >
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1">
                  <label className="settings-switch">
                    <span>{locale.sortable}</span>
                    <Switch
                      defaultChecked
                      onChange={handleSortableSwitchChange}
                    />
                  </label>
                </Menu.Item>
                <Menu.Item key="2">
                  <label className="settings-switch">
                    <span>{locale.messageFlag}</span>
                    <Switch
                      defaultChecked
                      onChange={handleMessageSwitchChange}
                    />
                  </label>
                </Menu.Item>
                <Menu.Item key="3">
                  <label style={radioStyle} className="settings-switch">
                    {locale.sstFlag}
                  </label>
                  <Radio.Group onChange={handleSstSwitchChange} value={sstFlag}>
                    <Radio style={radioStyle} value="file">
                      {locale.file}
                    </Radio>
                    <Radio style={radioStyle} value="files">
                      {locale.files}
                    </Radio>
                    <Radio style={radioStyle} value="mic">
                      {locale.mic}
                    </Radio>
                  </Radio.Group>
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
        </Tooltip>
      </div>
    </header>
  )
}

export default Header