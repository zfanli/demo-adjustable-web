import React, { useState, useEffect } from 'react'
import { Empty } from 'antd'
import { useTransition, animated as a } from 'react-spring/web.cjs'
import { uniq, isEqual } from 'lodash'
import { Keyword } from '../type'
import MenuItem from './MenuItem'
import { useDispatch } from 'react-redux'
import { handleSwitchModalFlag } from '../actions'

interface Props {
  keywords: Keyword[]
}

const DynamicMenu: React.FC<Props> = props => {
  const keywords = props.keywords
  const [menuItems, setMenuItems] = useState<string[]>([])
  const [previousKeywords, setPreviousKeywords] = useState<Keyword[]>([])

  const menuMap = [
    [['振込', '振り込み', '貸付', '出金'], ['振込貸付']],
    [['完済'], ['ATM情報', '振込入金講座登録']],
    [['延滞'], ['一時約束日', '振込入金口座登録']],
    [['解約'], ['仮受金返金', '書類発送']],
    [['返済額', '返済日', '返済回数'], ['返済計画シミュレーション']],
    [['増額', '契約額'], ['利用限度額', '利率変更']],
  ]

  useEffect(() => {
    let newMenuItems = menuItems

    keywords
      .filter(k => previousKeywords.findIndex(p => p.word === k.word) < 0)
      .forEach(k => {
        menuMap.forEach(m => {
          if (m[0].includes(k.word)) {
            newMenuItems = uniq(m[1].concat(newMenuItems))
          }
        })
      })

    !isEqual(menuItems, newMenuItems) && setMenuItems(newMenuItems)
    setPreviousKeywords(keywords)
  }, [keywords, menuItems, menuMap, previousKeywords])

  const transition = useTransition(menuItems, (m: any) => m, {
    from: { opacity: 0, height: '0rem' },
    leave: { opacity: 0, height: '0rem' },
    to: { opacity: 1, height: '2rem' },
    enter: { opacity: 1, height: '2rem' },
  })

  const dispatch = useDispatch()

  const handleClick = (title: string) => {
    // Put some data for modal.
    return () => dispatch(handleSwitchModalFlag(title, true))
  }

  return keywords.length === 0 ? (
    <Empty description="No Data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
  ) : (
    <div className="normal-menu">
      {transition.map(({ item, props, key }) => (
        <a.div key={key} style={props} className="normal-menu-item">
          <MenuItem name={item} onClick={handleClick(item)} />
        </a.div>
      ))}
    </div>
  )
}

export default DynamicMenu
