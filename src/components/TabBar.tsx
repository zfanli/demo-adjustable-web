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
  const dispatch = useDispatch()
  const keys = useSelector((state: State) => state.panelKeys)
  const { handleResize } = props
  useEffect(() => {
    handleResize()

    return function clean() {
      setTimeout(handleResize, 10)
    }
  }, [handleResize])

  const handleClick = (key: string) => {
    return () => dispatch(setActivePanel(panels.findIndex(p => p.key === key)))
  }

  return (
    <div className="tab-bar">
      {names.map((p, i) => (
        <div className="tab" key={keys[i]} onClick={handleClick(keys[i])}>
          {p}
        </div>
      ))}
    </div>
  )
}

export default TabBar
