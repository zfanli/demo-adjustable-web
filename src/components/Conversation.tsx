import React from 'react'
import { Icon, Input } from 'antd'

const Conversation: React.FC = () => {
  return (
    <div className="conversation">
      <div className="conversation-body">conversation body</div>
      <div className="conversation-buttons">
        <button>
          <Icon type="trademark-circle" theme="filled" />
        </button>
        <Input placeholder="Keywords..." />
      </div>
    </div>
  )
}

export default Conversation
