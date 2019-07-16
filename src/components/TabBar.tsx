import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Icon } from 'antd'
import { State } from '../type'
import { setActivePanel, handlePanelRetrieve } from '../actions'

interface Props {
  handleResize: () => void
}

const TabBar: React.FC<Props> = (props: Props) => {
  const names = useSelector(
    (state: State) => state.settings.locale.panels
  ) as string[]
  const panels = useSelector((state: State) => state.panels)
  const sortable = useSelector((state: State) => state.settings.sortable)
  const tabs = useSelector((state: State) => state.tabs)

  const dispatch = useDispatch()

  const { handleResize } = props

  const keyMapToName = panels.map((p, i) => ({
    key: p.key,
    name: names[i],
    index: i,
  }))

  const tabMap = keyMapToName.filter(k =>
    Object.keys(tabs)
      .filter(k => !sortable || tabs[k])
      .includes(k.key)
  )

  const triggerResizeAction = tabMap.length > 0

  useEffect(() => {
    handleResize()

    return function cleanup() {
      setTimeout(handleResize, 10)
    }
  }, [handleResize, triggerResizeAction])

  const handleClick = (index: number) => {
    return () => {
      dispatch(handlePanelRetrieve(index))
      dispatch(setActivePanel(index))
    }
  }

  return tabMap.length !== 0 ? (
    <div className="tab-bar">
      {tabMap.map(tab => (
        <div className="tab" key={tab.key} onClick={handleClick(tab.index)}>
          <span>{tab.name}</span>
          <div className="icons">
            <Icon type="info-circle" />
          </div>
        </div>
      ))}
    </div>
  ) : null
}

export default TabBar
