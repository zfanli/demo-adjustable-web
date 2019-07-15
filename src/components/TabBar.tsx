import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { State } from '../type'
import { setActivePanel } from '../actions'

interface Props {
  handleResize: () => void
}

const TabBar: React.FC<Props> = (props: Props) => {
  const names = useSelector(
    (state: State) => state.settings.locale.panels
  ) as string[]
  const panels = useSelector((state: State) => state.panels)
  const tabs = useSelector((state: State) => state.tabs)

  const dispatch = useDispatch()

  const { handleResize } = props

  const keyMapToName = panels.map((p, i) => ({
    key: p.key,
    name: names[i],
    index: i,
  }))
  const tabMap = keyMapToName.filter(k => tabs.includes(k.key))

  useEffect(() => {
    handleResize()

    return function cleanup() {
      setTimeout(handleResize, 10)
    }
  }, [handleResize, tabs])

  const handleClick = (index: number) => {
    return () => dispatch(setActivePanel(index))
  }

  return tabs.length !== 0 ? (
    <div className="tab-bar">
      {tabMap.map(tab => (
        <div className="tab" key={tab.key} onClick={handleClick(tab.index)}>
          {tab.name}
        </div>
      ))}
    </div>
  ) : null
}

export default TabBar
