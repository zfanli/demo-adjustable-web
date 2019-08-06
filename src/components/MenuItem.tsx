import React, { useState } from 'react'
import { Modal } from 'antd'
import { AnimatedValue, animated as a } from 'react-spring'
import { useSelector } from 'react-redux'
import { range } from 'lodash'
import { State } from '../type'

interface Props {
  name: string
  style: AnimatedValue<any>
}

const MenuItem: React.FC<Props> = (props: Props) => {
  const locale = useSelector((state: State) => state.settings.locale)

  const [modalFlag, setModalFlag] = useState(false)

  const toggleModalFlag = () => setModalFlag(!modalFlag)

  return (
    <>
      <a.div
        style={props.style}
        className="normal-menu-item"
        onClick={toggleModalFlag}
      >
        {props.name}
      </a.div>
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
