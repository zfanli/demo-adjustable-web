import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Icon } from 'antd'
import { State } from '../type'
import { handleSwitchActive, handlePanelRetrieve } from '../actions'
import { useTransition, animated as a } from 'react-spring'

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

  const transitions = useTransition(tabMap, (t: any) => t.key, {
    from: {
      width: '0%',
      opacity: 0,
      marginLeft: '0rem',
      padding: '0rem 0rem',
      backgroundColor: '#FFFFFF',
      color: '#000000a6',
    },
    to: (t: any) => ({
      width: '15%',
      opacity: 1,
      marginLeft: '0.5rem',
      padding: '0rem 0.5rem',
      backgroundColor: tabs[t.key] ? '#47B6C2' : '#FFFFFF',
      color: tabs[t.key] ? '#ffffffff' : '#000000a6',
    }),
    enter: (t: any) => ({
      width: '15%',
      opacity: 1,
      marginLeft: '0.5rem',
      padding: '0rem 0.5rem',
      backgroundColor: tabs[t.key] ? '#47B6C2' : '#FFFFFF',
      color: tabs[t.key] ? '#ffffffff' : '#000000a6',
    }),
    update: (t: any) => ({
      width: '15%',
      opacity: 1,
      marginLeft: '0.5rem',
      padding: '0rem 0.5rem',
      backgroundColor: tabs[t.key] ? '#47B6C2' : '#FFFFFF',
      color: tabs[t.key] ? '#ffffffff' : '#000000a6',
    }),
    leave: {
      width: '0%',
      opacity: 0,
      marginLeft: '0rem',
      padding: '0rem 0rem',
      backgroundColor: '#FFFFFF',
      color: '#000000a6',
    },
  })

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
      dispatch(handleSwitchActive(index))
    }
  }

  return (
    <div
      className="tab-bar"
      style={{ display: tabMap.length !== 0 ? '' : 'none' }}
    >
      {transitions.map(({ item, props, key }) => (
        <a.div
          className="tab"
          key={key}
          onClick={handleClick(item.index)}
          style={props}
        >
          <span>{item.name}</span>
          <div className="icons">
            {tabs[item.key] ? (
              <Icon type="book" theme="filled" />
            ) : (
              <Icon type="book" />
            )}
          </div>
        </a.div>
      ))}
    </div>
  )
}

export default TabBar
