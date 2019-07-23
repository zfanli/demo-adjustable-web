import React, {
  useState,
  ChangeEvent,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from 'react'
import { Input, Button, Icon, Empty, Tooltip } from 'antd'
import { useSelector, useDispatch } from 'react-redux'

import sstService from '../watson-speech-tool/sst-service'

import { State, ResultResponse } from '../type'
import { setResultKeywords, handleConversationChanged } from '../actions'
import { debounce, throttle, range } from 'lodash'

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
    (state: State) => state.settings.locale.editNotAllowedWhileRecording
  )
  const speaker = useSelector((state: State) => state.settings.locale.speaker)
  const analyzing = useSelector(
    (state: State) => state.settings.locale.analyzing
  )
  const messageLeaveDelay = useSelector(
    (state: State) => state.settings.messageLeaveDelay
  )
  const sstFlag = useSelector((state: State) => state.settings.sstFlag)
  const conversation = useSelector(
    (state: State) => state.watsonSpeech.conversation
  )

  // State for local control.
  const [sst, setSst] = useState(
    range(sstFlag === 'files' ? 2 : 1).map(() =>
      sstService({ tokenUrl, keywords: defaultKeywords })
    )
  )
  const [recordFlag, setRecordFlag] = useState(false)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [keywords, setKeywords] = useState(defaultKeywords)
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
      }, messageLeaveDelay)
    } else {
      const k = e.target.value.split(',').map(k => k.trim())
      setKeywords(k)
    }
  }

  useEffect(() => {
    setSst(
      range(sstFlag === 'files' ? 2 : 1).map(() =>
        sstService({ tokenUrl, keywords })
      )
    )
  }, [keywords, sstFlag, tokenUrl, setSst])

  // Trigger colors.
  const type = recordFlag ? 'danger' : 'primary'

  // Control the times to be called, every 200ms can be called once.
  const dispatchResultKeywordsWithThrottle = useMemo(
    () => throttle(keywords => dispatch(setResultKeywords(keywords)), 200),
    [dispatch]
  )
  const dispatchResultConversationWithThrottle = useMemo(
    () =>
      throttle(
        conversation => dispatch(handleConversationChanged(conversation)),
        200
      ),
    [dispatch]
  )

  // Handle response from api server.
  const responseHandler = useCallback(
    (res: ResultResponse) => {
      dispatchResultConversationWithThrottle(res.textResult)
      dispatchResultKeywordsWithThrottle(res.keywordResult)
    },
    [dispatchResultKeywordsWithThrottle, dispatchResultConversationWithThrottle]
  )

  // Handle audio button.
  const handleAudioButtonClick = () => {
    if (!recordFlag && sstFlag === 'mic') {
      // Set start flag.
      setRecordFlag(true)

      // ------------------------------------------------------------------------
      // ---------------------- Configure Watson Speech -------------------------

      // マイクロフォンを開き、会話解析を実施
      sst[0] && sst[0].record(responseHandler, false)

      // ------------------------------ Ending ----------------------------------
      // ------------------------------------------------------------------------
    } else if (recordFlag && sstFlag === 'mic') {
      // Set stop flag.
      setRecordFlag(false)
      // Stop.
      sst[0] && sst[0].record(undefined, true)
    } else if (!recordFlag && sstFlag === 'files') {
      // Set start flag.
      setRecordFlag(true)

      // ------------------------------------------------------------------------
      // ---------------------- Configure Watson Speech -------------------------

      const file1 = 'audio/ja-JP_Broadband_sample1.wav'
      const file2 = 'audio/ja-JP_Broadband_sample2.wav'

      // ファイルから、会話解析を実施
      sst[0] && sst[0].playFile(file1, 0, responseHandler, false)
      sst[1] && sst[1].playFile(file2, 1, responseHandler, false)

      // ------------------------------ Ending ----------------------------------
      // ------------------------------------------------------------------------
    } else if (recordFlag && sstFlag === 'files') {
      // Set stop flag.
      setRecordFlag(false)
      // Stop.
      sst[0] && sst[0].playFile(undefined, 0, undefined, true)
      sst[1] && sst[1].playFile(undefined, 0, undefined, true)
    } else if (!recordFlag && sstFlag === 'file') {
      // Set start flag.
      setRecordFlag(true)

      // ------------------------------------------------------------------------
      // ---------------------- Configure Watson Speech -------------------------

      const file1 = 'audio/records01.wav'

      // ファイルから、会話解析を実施
      sst[0] && sst[0].playFile(file1, undefined, responseHandler, false)

      // ------------------------------ Ending ----------------------------------
      // ------------------------------------------------------------------------
    } else if (recordFlag && sstFlag === 'file') {
      // Set stop flag.
      setRecordFlag(false)
      // Stop.
      sst[0] && sst[0].playFile(undefined, undefined, undefined, true)
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
