import React, { useState } from 'react'
import { Input, Button, Icon, Empty } from 'antd'

const Conversation: React.FC = () => {
  const [recordFlag, setRecordFlag] = useState(false)
  const type = recordFlag ? 'danger' : 'primary'
  const handleAudioButtonClick = () => setRecordFlag(!recordFlag)
  return (
    <div className="conversation">
      <div className="conversation-body">
        <Empty description="No Data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
      <div className="conversation-buttons">
        <Button
          type={type}
          className={type}
          size="small"
          onClick={handleAudioButtonClick}
        >
          {recordFlag ? (
            <Icon type="audio" theme="filled" />
          ) : (
            <Icon type="audio" />
          )}
        </Button>
        <Input size="small" placeholder="Keywords..." />
      </div>
    </div>
  )
}

export default Conversation
