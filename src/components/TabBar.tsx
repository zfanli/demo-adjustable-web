import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTransition, animated as a } from 'react-spring/web.cjs'
import { Icon } from 'antd'
import { State } from '../type'
import { handleSwitchActive, handlePanelRetrieve } from '../actions'

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

  useEffect(() => {
    !sortable && setTimeout(handleResize, 100)
  }, [sortable, handleResize])

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

  const outStyle = {
    width: '0%',
    bottom: '-1.5rem',
    height: '0rem',
    marginLeft: '0rem',
    padding: '0rem 0rem',
  }
  const inStyle = (t: any) => ({
    width: '17.5%',
    bottom: '0rem',
    height: '1.5rem',
    marginLeft: '-0.3rem',
    padding: '0rem 0.5rem',
  })

  const transitions = useTransition(tabMap, (t: any) => t.key, {
    from: outStyle,
    to: inStyle,
    enter: inStyle,
    update: inStyle,
    leave: outStyle,
  })

  const handleClick = (index: number) => {
    return () => {
      dispatch(handlePanelRetrieve(index))
      dispatch(handleSwitchActive(index))
    }
  }

  return (
    <div className="tab-bar" style={{ height: tabMap.length !== 0 ? '' : '0' }}>
      {transitions.map(({ item, props, key }) => (
        <a.div
          className={`tab ${tabs[item.key] ? 'minimized' : ''}`}
          key={key}
          onClick={handleClick(item.index)}
          style={props}
        >
          <span className="tab-name">{item.name}</span>
          <div className="tab-icons">
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
