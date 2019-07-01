import React, {
  useState,
  ChangeEvent,
  useRef,
  useCallback,
  useMemo,
} from 'react'
import { Input, Button, Icon, Empty, Tooltip } from 'antd'
import { useSelector, useDispatch } from 'react-redux'

import sstService from '../watson-speech-tool/sst-service'

import { State, ResultResponse, TextWithLabel } from '../type'
import { setResultKeywords } from '../actions'
import { debounce, throttle } from 'lodash'

const Conversation: React.FC = () => {
  // Get data from store.
  const defaultKeywords = useSelector(
    (state: State) => state.watsonSpeech.defaultKeywords
  )
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
  const [keywords, setKeywords] = useState(defaultKeywords)
  const [conversation, setConversation] = useState<TextWithLabel[]>([])
  // Handle scroll of messages box.
  const messageBox = useRef<HTMLDivElement>(null)
  const [scrollToBottom, setScrollToBottom] = useState(true)

  const handleMessageBoxScroll = debounce(() => {
    if (!messageBox || !messageBox.current) {
      return
    }
    const scrollTop =
      messageBox.current.scrollTop + messageBox.current.clientHeight
    const scrollHeight = messageBox.current.scrollHeight
    const bottomFlag = scrollTop === scrollHeight
    setScrollToBottom(bottomFlag)
  }, 100)

  messageBox &&
    messageBox.current &&
    scrollToBottom &&
    messageBox.current.scrollTo(
      0,
      messageBox.current.scrollHeight - messageBox.current.clientHeight
    )

  // Handle keywords changes.
  // Show a message if edit is not allowed.
  const handleKeywordsChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (recordFlag) {
      setTooltipVisible(true)
      setTimeout(() => {
        setTooltipVisible(false)
      }, 2000)
    } else {
      const k = e.target.value.split(',').map(k => k.trim())
      setKeywords(k)
    }
  }

  // Trigger colors.
  const type = recordFlag ? 'danger' : 'primary'

  // Control the times to be called, every 200ms can be called once.
  const dispatchResultKeywordsWithThrottle = useMemo(
    () => throttle(keywords => dispatch(setResultKeywords(keywords)), 200),
    [dispatch]
  )

  // Handle response from api server.
  const responseHandler = useCallback(
    (res: ResultResponse) => {
      setConversation(res.textResult)
      dispatchResultKeywordsWithThrottle(res.keywordResult)
    },
    [dispatchResultKeywordsWithThrottle]
  )

  // Handle audio button.
  const handleAudioButtonClick = () => {
    if (!recordFlag) {
      // Set start flag.
      setRecordFlag(true)

      // ------------------------------------------------------------------------
      // ---------------------- Configure Watson Speech -------------------------

      // SSTのAccessTokenの取得URLを設定
      sstService.setTokenUrl(tokenUrl)

      // キーサードを設定
      sstService.setKeywords(keywords)

      // マイクロフォンを開き、会話解析を実施
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
      <div
        className="conversation-body"
        ref={messageBox}
        onScroll={handleMessageBoxScroll}
      >
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
            value={keywords.join(',')}
            onChange={handleKeywordsChange}
            placeholder="Keywords..."
          />
        </Tooltip>
      </div>
    </div>
  )
}

export default Conversation
