import React from 'react'
import { useTransition } from 'react-spring'
import { ReplyInput } from '../type'
import ReplyInformationInput from './ReplyInformationInput'
import FixedMenu from './FixedMenu'

interface Props {
  replyInputFlag: boolean
  fixedMenuItems: string[]
  reply: {
    list: ReplyInput[]
    input: ReplyInput
  }
}

const FixedReplyTransition: React.FC<Props> = props => {
  const { replyInputFlag, fixedMenuItems, reply } = props

  // Transition.
  const switchTransition = useTransition(replyInputFlag, null, {
    from: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0,
    },
    leave: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
    },
    config: { duration: 100 },
  })

  return (
    <>
      {switchTransition.map(t =>
        t.item ? (
          <ReplyInformationInput
            key={t.key}
            style={t.props}
            input={reply.input}
            list={reply.list}
          />
        ) : (
          <FixedMenu
            key={t.key}
            style={t.props}
            fixedMenuItems={fixedMenuItems}
          />
        )
      )}
    </>
  )
}

export default FixedReplyTransition
