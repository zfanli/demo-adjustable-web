import React, { useState, ChangeEvent, useRef, useEffect } from 'react'
import { Input, Button, Icon, Empty, Tooltip } from 'antd'
import { useSelector, useDispatch } from 'react-redux'

import sstService from '../watson-speech-tool/sst-service'

import { State, ResultResponse, TextWithLabel } from '../type'
import { setResultKeywords } from '../actions'

const Conversation: React.FC = () => {
  // Get data from store.
  const keywords = useSelector((state: State) => state.watsonSpeech.keywords)
  const tokenUrl = useSelector(
    (state: State) => state.watsonSpeech.accessTokenURL
  )
  const dispatch = useDispatch()

  // Display texts.
  const tooltipText = useSelector(
    (state: State) => state.locale.editNotAllowedWhileRecording
  )
  const speaker = useSelector((state: State) => state.locale.speaker)
  const analyzing = useSelector((state: State) => state.locale.analyzing)

  // State for local control.
  const [recordFlag, setRecordFlag] = useState(false)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [keywordsText, setKeywordsText] = useState(keywords.join(','))
  const [conversation, setConversation] = useState<TextWithLabel[]>([])
  // Ref for handle scroll of messages box.
  const messageBox = useRef(null)
  const scrollToBottom = useState(true)

  // const handleMessageBoxScroll = (e: )

  // Handle keywords changes.
  // Show a message if edit is not allowed.
  const handleKeywordsChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (recordFlag) {
      setTooltipVisible(true)
      setTimeout(() => {
        setTooltipVisible(false)
      }, 2000)
    } else {
      setKeywordsText(e.target.value)
    }
  }

  // Trigger colors.
  const type = recordFlag ? 'danger' : 'primary'

  const responseHandler = (res: ResultResponse) => {
    setConversation(res.textResult)
    dispatch(setResultKeywords(res.keywordResult))
  }

  // Handle audio button.
  const handleAudioButtonClick = () => {
    if (!recordFlag) {
      // Set start flag.
      setRecordFlag(true)

      // ------------------------------------------------------------------------
      // ---------------------- Configure Watson Speech -------------------------

      //SSTのAccessTokenの取得URLを設定
      sstService.setTokenUrl(tokenUrl)

      //キーサードを設定
      sstService.setKeywords(keywords)

      //マイクロフォンを開き、会話解析を実施
      sstService.record(responseHandler)

      // ------------------------------ Ending ----------------------------------
      // ------------------------------------------------------------------------
    } else {
      // Set stop flag.
      setRecordFlag(false)
      // Auto stop if it's running now.
      sstService.record(undefined, true)
    }
  }

  return (
    <div className="conversation">
      <div className="conversation-body" ref={messageBox}>
        {conversation.length ? (
          conversation.map((piece, i) => (
            <div
              key={i}
              className={`conversation-message ${piece.speaker ===
                'analyzing' && 'analyzing'}`}
            >
              <span className="speaker-label">
                {piece.speaker === 'analyzing'
                  ? analyzing
                  : `${speaker} ${piece.speaker}: `}
              </span>
              <span className="transcript">{piece.transcript}</span>
            </div>
          ))
        ) : (
          <Empty description="No Data" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
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
        <Tooltip title={tooltipText} visible={tooltipVisible}>
          <Input
            size="small"
            value={keywordsText}
            onChange={handleKeywordsChange}
            placeholder="Keywords..."
          />
        </Tooltip>
      </div>
    </div>
  )
}

export default Conversation
