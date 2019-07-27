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
    // opacity: 0,
    // marginLeft: '0rem',
    padding: '0rem 0rem',
    // backgroundColor: '#4e7383',
    // color: '#000000a6',
  }
  const inStyle = (t: any) => ({
    width: '17.5%',
    bottom: '0rem',
    height: '1.5rem',
    // opacity: 1,
    // marginLeft: '0.5rem',
    padding: '0rem 0.5rem',
    // backgroundColor: '#4e7383',
    // color: tabs[t.key] ? '#ffffffff' : '#000000a6',
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
          className="tab"
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
