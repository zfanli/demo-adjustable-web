import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Icon, Menu, Dropdown, Switch, Radio } from 'antd'
import { ClickParam } from 'antd/lib/menu'
import { State } from '../type'
import {
  handleSwitchLocale,
  handleSwitchSortable,
  handlePanelReset,
  handleSwitchMessageFlag,
  handleSwitchSstFlag,
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

  const [settingsVisible, setSettingsVisible] = useState(false)

  const sortableText = useSelector(
    (state: State) => state.settings.locale.sortable
  )
  const messageFlagText = useSelector(
    (state: State) => state.settings.locale.messageFlag
  )
  const sstFlagText = useSelector(
    (state: State) => state.settings.locale.sstFlag
  )
  const fileText = useSelector((state: State) => state.settings.locale.file)
  const filesText = useSelector((state: State) => state.settings.locale.files)
  const micText = useSelector((state: State) => state.settings.locale.mic)
  const resetText = useSelector(
    (state: State) => state.settings.locale.resetPosition
  )

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
                <label className="settings-switch">
                  <span>{sortableText}</span>
                  <Switch
                    defaultChecked
                    onChange={handleSortableSwitchChange}
                  />
                </label>
              </Menu.Item>
              <Menu.Item key="2">
                <label className="settings-switch">
                  <span>{messageFlagText}</span>
                  <Switch defaultChecked onChange={handleMessageSwitchChange} />
                </label>
              </Menu.Item>
              <Menu.Item key="3">
                <label style={radioStyle} className="settings-switch">
                  {sstFlagText}
                </label>
                <Radio.Group onChange={handleSstSwitchChange} value={sstFlag}>
                  <Radio style={radioStyle} value="file">
                    {fileText}
                  </Radio>
                  <Radio style={radioStyle} value="files">
                    {filesText}
                  </Radio>
                  <Radio style={radioStyle} value="mic">
                    {micText}
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
      </div>
    </header>
  )
}

export default Header
