import React, { useState } from 'react'
import { Modal } from 'antd'
import { useSelector } from 'react-redux'
import { range } from 'lodash'
import { State } from '../type'

interface Props {
  name: string
}

const MenuItem: React.FC<Props> = (props: Props) => {
  const locale = useSelector((state: State) => state.settings.locale)

  const [modalFlag, setModalFlag] = useState(false)

  const toggleModalFlag = () => setModalFlag(!modalFlag)

  return (
    <>
      <div onClick={toggleModalFlag}>{props.name}</div>
      <Modal
        title={props.name}
        visible={modalFlag}
        onOk={toggleModalFlag}
        onCancel={toggleModalFlag}
        okText={locale.ok}
        cancelText={locale.cancel}
        getContainer={() => document.body}
        zIndex={9999}
        centered={true}
        width="60vw"
        bodyStyle={{
          height: '60vh',
          overflow: 'auto',
        }}
      >
        {range(50).map(i => (
          <div key={i}>FOR TEST PLACEHOLDER</div>
        ))}
      </Modal>
    </>
  )
}

export default MenuItem
