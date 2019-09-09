import React, { useState, useRef, useCallback, useMemo } from 'react'
import { Button, Icon, Empty, message } from 'antd'
import { useDispatch } from 'react-redux'
import { debounce, throttle, range } from 'lodash'

import sstService from '../watson-speech-tool/sst-service'

import { ResultResponse, Locale, TextWithLabel, Keyword } from '../type'
import { handleResultKeywords, handleConversationChanged } from '../actions'

interface Props {
  defaultKeywords: string[]
  keywords: Keyword[]
  tokenUrl: string
  locale: Locale
  messageLeaveDelay: number
  sstFlag: string
  conversation: TextWithLabel[]
  files: any[]
}

const Conversation: React.FC<Props> = props => {
  // Get data from store.
  const {
    defaultKeywords,
    tokenUrl,
    sstFlag,
    conversation,
    keywords,
    files,
  } = props

  const dispatch = useDispatch()

  // Display texts.
  const {
    customer,
    service,
    analyzing,
    errorNoFileSelected,
  } = props.locale as {
    [k: string]: string
  }
  const mapSpeakers: { [k: string]: string } = { customer, service }

  // State for local control.
  const [sst] = useState(
    range(2).map(() => sstService({ tokenUrl, keywords: defaultKeywords }))
  )
  const [recordFlag, setRecordFlag] = useState(false)
  // Handle scroll of messages box.
  const messageBox = useRef<HTMLDivElement>(null)
  const [scrollToBottom, setScrollToBottom] = useState(true)
  const [players] = useState(range(2).map(() => new Audio()))

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

  if (messageBox && messageBox.current && scrollToBottom) {
    if (typeof messageBox.current.scrollTo === 'function') {
      messageBox.current.scrollTo(
        0,
        messageBox.current.scrollHeight - messageBox.current.clientHeight
      )
    } else {
      messageBox.current.scrollTo = (messageBox.current.scrollHeight -
        messageBox.current.clientHeight) as any
    }
  }

  // Trigger colors.
  const type = recordFlag ? 'danger' : 'primary'

  // Control the times to be called, every 200ms can be called once.
  const dispatchResultKeywordsWithThrottle = useMemo(
    () =>
      throttle(
        (keywords, label) => dispatch(handleResultKeywords(keywords, label)),
        200
      ),
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
      dispatchResultKeywordsWithThrottle(res.keywordResult, res.label)
    },
    [dispatchResultKeywordsWithThrottle, dispatchResultConversationWithThrottle]
  )

  // Reset conversation.
  // Still some bugs need to be fixed.
  const resetConversation = () => {
    dispatch(handleResultKeywords([], 'reset'))
    dispatch(handleConversationChanged([]))
  }

  // Handle audio button.
  const handleAudioButtonClick = () => {
    if (!recordFlag && sstFlag === 'mic') {
      resetConversation()
      // Set start flag.
      setRecordFlag(true)

      // ------------------------------------------------------------------------
      // ---------------------- Configure Watson Speech -------------------------

      // マイクロフォンを開き、会話解析を実施
      sst[0] &&
        sst[0].record(responseHandler, () => setRecordFlag(false), false)

      // ------------------------------ Ending ----------------------------------
      // ------------------------------------------------------------------------
    } else if (!recordFlag && (sstFlag === 'files' || sstFlag === 'upload2')) {
      // check for upload files.
      if (sstFlag === 'upload2' && (!files[0] || !files[1])) {
        message.error(errorNoFileSelected)
        return
      }

      resetConversation()
      // Set start flag.
      setRecordFlag(true)

      // ------------------------------------------------------------------------
      // ---------------------- Configure Watson Speech -------------------------

      // const file1 = 'audio/ja-JP_Broadband_sample1.wav'
      // const file2 = 'audio/ja-JP_Broadband_sample2.wav'

      // const file1 = 'audio/speaker1s.wav'
      // const file2 = 'audio/speaker2s.wav'

      let file1 = 'audio/service.wav'
      let file2 = 'audio/customer.wav'
      let source: string | undefined = undefined

      if (sstFlag === 'upload2') {
        file1 = files[0]
        file2 = files[1]
        source = 'upload'
      }

      // ファイルから、会話解析を実施
      sst[0] &&
        sst[0].playFile(
          file1,
          'service',
          responseHandler,
          () => setRecordFlag(false),
          false,
          source
        )
      sst[1] &&
        sst[1].playFile(
          file2,
          'customer',
          responseHandler,
          () => setRecordFlag(false),
          false,
          source
        )

      // Play audios.
      players[0].src = file1
      players[1].src = file2
      players.forEach(p => p.play())

      // ------------------------------ Ending ----------------------------------
      // ------------------------------------------------------------------------
    } else if (!recordFlag && (sstFlag === 'file' || sstFlag === 'upload1')) {
      // Check file.
      if (sstFlag === 'upload1' && !files[0]) {
        message.error(errorNoFileSelected)
        return
      }

      resetConversation()
      // Set start flag.
      setRecordFlag(true)

      // ------------------------------------------------------------------------
      // ---------------------- Configure Watson Speech -------------------------

      let file1 = 'audio/conversationSample.wav'
      let source: string | undefined = undefined

      if (sstFlag === 'upload1') {
        file1 = files[0]
        source = 'upload'
      }

      // ファイルから、会話解析を実施
      sst[0] &&
        sst[0].playFile(
          file1,
          undefined,
          responseHandler,
          () => setRecordFlag(false),
          false,
          source
        )

      // Play audio.
      players[0].src = file1
      players[0].play()

      // ------------------------------ Ending ----------------------------------
      // ------------------------------------------------------------------------
    } else {
      // Set stop flag.
      setRecordFlag(false)
      // Stop.
      sst.map(s => s.record(undefined, undefined, true))
      players.forEach(p => p.pause())
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
              className={`conversation-message ${(piece.speaker ===
                'analyzing' ||
                piece.speaker === undefined) &&
                'analyzing'}`}
            >
              <span className="speaker-label">
                {piece.speaker === 'analyzing' || piece.speaker === undefined
                  ? analyzing
                  : `${mapSpeakers[piece.speaker]}: `}
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
        <div className="conversation-keywords">
          {defaultKeywords.map(k => (
            <span
              key={k}
              className={`keyword ${
                keywords.findIndex(w => w.word === k) > -1 ? 'spotted' : ''
              }`}
            >
              {k}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Conversation
