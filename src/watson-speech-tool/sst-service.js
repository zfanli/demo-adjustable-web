/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/camelcase */
import recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone'
import recognizeFile from 'watson-speech/speech-to-text/recognize-file'
import Axios from 'axios'

function sst(config) {
  var textResult = []
  var keywordResult = []
  // var keywordsText = '東京,浅草寺,バス';
  // var tokenUrl = 'http://localhost:8080/cca/ssttoken';
  var tokenUrl = config.tokenUrl
  var lastStream = null
  var recordCallback = null
  var recordState = {
    accessToken: '',
    // token: 'A6jmaKwjgRzfYzfB6YxJYdaiRdwhOTgS8_pY29Kx26v7',
    serviceUrl: 'https://stream.watsonplatform.net/speech-to-text/api',
    model: 'ja-JP_BroadbandModel',
    rawMessages: [],
    formattedMessages: [],
    audioSource: null,
    speakerLabels: true,
    keywords: config.keywords,
    // keywords: ['東京','浅草寺','バス'],
    // transcript model and keywords are the state that they were when the button was clicked.
    // Changing them during a transcription would cause a mismatch between the setting sent to the
    // service and what is displayed on the demo, and could cause bugs.
    settingsAtStreamStart: {
      model: '',
      keywords: [],
      speakerLabels: true,
    },
    error: null,
  }

  function getRecognizeOptions(extra) {
    // const keywords = getKeywordsArrUnique();
    // recordState.keywords = keywordsText.split(',');
    return Object.assign(
      {
        // formats phone numbers, currency, etc. (server-side)
        access_token: recordState.accessToken,
        token: recordState.token,
        smart_formatting: true,
        format: true, // adds capitals, periods, and a few other things (client-side)
        model: recordState.model,
        objectMode: true,
        interim_results: true,
        // note: in normal usage, you'd probably set this a bit higher
        word_alternatives_threshold: 0.3,
        keywords: recordState.keywords,
        keywords_threshold: recordState.keywords.length ? 0.6 : undefined, // note: in normal usage, you'd probably set this a bit higher
        timestamps: true, // set timestamps for each word - automatically turned on by speaker_labels
        // includes the speaker_labels in separate objects unless resultsBySpeaker is enabled
        speaker_labels: recordState.speakerLabels,
        // combines speaker_labels and results together into single objects,
        // making for easier transcript outputting
        resultsBySpeaker: recordState.speakerLabels,
        // allow interim results through before the speaker has been determined
        speakerlessInterim: recordState.speakerLabels,
        url: recordState.serviceUrl,
      },
      extra
    )
  }

  function getAccessToken(callback) {
    Axios.get(tokenUrl, {}).then(({ data }) => {
      // console.log(data);
      callback(data.accessToken)
    })
  }
  function handleStream(stream) {
    // console.log(stream)
    // cleanup old stream if appropriate
    if (lastStream) {
      lastStream.stop()
      lastStream.removeAllListeners()
      lastStream.recognizeStream.removeAllListeners()
    }
    lastStream = stream
    // captureSettings();

    // grab the formatted messages and also handle errors and such
    stream
      .on('data', handleFormattedMessage)
      .on('end', handleTranscriptEnd)
      .on('error', handleError)

    // when errors occur, the end event may not propagate through the helper streams.
    // However, the recognizeStream should always fire a end and close events
    stream.recognizeStream.on('end', () => {
      if (recordState.error) {
        handleTranscriptEnd()
      }
    })

    // grab raw messages from the debugging events for display on the JSON tab
    stream.recognizeStream
      .on('message', (frame, json) =>
        handleRawMessage({ sent: false, frame, json })
      )
      .on('send-json', json => handleRawMessage({ sent: true, json }))
      .once('send-data', () =>
        handleRawMessage({
          sent: true,
          binary: true,
          data: true, // discard the binary data to avoid waisting memory
        })
      )
      .on('close', (code, message) =>
        handleRawMessage({ close: true, code, message })
      )
  }

  function stopTranscription() {
    if (lastStream) {
      lastStream.stop()
    }
    // setState({ audioSource: null });
    recordState.audioSource = null
  }

  function reset() {
    if (recordState.audioSource) {
      stopTranscription()
    }
    // setState({ rawMessages: [], formattedMessages: [], error: null });
    recordState.rawMessages = []
    recordState.formattedMessages = []
    recordState.error = null
    textResult = []
    keywordResult = []
  }

  function handleTranscriptEnd() {
    recordState.audioSource = null
    // console.log('------------------handleTranscriptEnd----------------------');
  }

  function handleRawMessage(msg) {
    const { rawMessages } = recordState
    recordState.rawMessages = rawMessages.concat(msg)

    // if(msg.frame){
    //     console.log('------------------message.frame----------------------');
    //     console.log(msg.frame);
    //     console.log('------------------message.json----------------------');
    //     console.log(msg.json);
    // }else if(msg.sent){
    //     console.log('------------------sent-json.json----------------------');
    //     console.log(msg.json);
    // }
  }

  function handleFormattedMessage(msg) {
    const { formattedMessages } = recordState
    recordState.formattedMessages = formattedMessages.concat(msg)
    // console.log('------------------handleFormattedMessage----------------------');
    console.log(msg)
    // console.log('results:' + (msg.results.length - 1));

    if (msg.results.length > 0) {
      textResult = []
      keywordResult = []
      let keywords = {}
      for (var i = 0; i < msg.results.length; i++) {
        const transcript = msg.results[i].alternatives[0].transcript
        const timestamp = msg.results[i].alternatives[0].timestamps[0][1]
        let speakerLabel = recordState.label
        if (!speakerLabel) {
          speakerLabel = msg.results[i].speaker
          speakerLabel =
            typeof speakerLabel !== 'undefined' ? speakerLabel : 'analyzing'
        }

        textResult.push({ speaker: speakerLabel, transcript, timestamp })

        if (msg.results[i].keywords_result) {
          for (var k in msg.results[i].keywords_result) {
            // let v = msg.results[i].keywords_result[k]
            // console.log(k,":",v);
            if (keywords[k]) {
              keywords[k] = keywords[k] + 1
            } else {
              keywords[k] = 1
              // Object.assign(keywords,{k:1});
            }
            // console.log(keywords);
          }
        }
      }
      for (var w in keywords) {
        let cnt = keywords[w]
        keywordResult.push({ word: w, count: cnt })
      }
      // console.log(keywordArr);
      keywordResult.sort(function(a, b) {
        var value1 = a.count
        var value2 = b.count
        return value2 - value1
      })

      recordCallback({ textResult: textResult, keywordResult: keywordResult })

      // console.log(keywordArr);
      // keywordResult.forEach((keyword)=>{
      //     menuResult+=(keyword.word + ':' + keyword.count +'回'+'\n');
      // });

      // $nextTick(() => {
      //     // let area = document.getElementById("resultAreaId");
      //     // area.scrollTop = area.scrollHeight;
      //     $refs.resultArea.scrollTop = $refs.resultArea.scrollHeight
      // });
    }
  }

  function handleError(err, extra) {
    console.error(err, extra)
    if (err.name === 'UNRECOGNIZED_FORMAT') {
      err =
        'Unable to determine content type from file name or header; mp3, wav, flac, ogg, opus, and webm are supported. Please choose a different file.'
    } else if (
      err.name === 'NotSupportedError' &&
      recordState.audioSource === 'mic'
    ) {
      err = 'This browser does not support microphone input.'
    } else if (err.message === "('UpsamplingNotAllowed', 8000, 16000)") {
      err =
        'Please select a narrowband voice model to transcribe 8KHz audio files.'
    } else if (err.message === 'Invalid constraint') {
      // iPod Touch does this on iOS 11 - there is a microphone, but Safari claims there isn't
      err = 'Unable to access microphone'
    }
    recordState.error = err.message || err
  }

  function handleStreamFile(stream) {
    // console.log(stream)
    // cleanup old stream if appropriate
    if (lastStream) {
      lastStream.stop()
      lastStream.removeAllListeners()
      lastStream.recognizeStream.removeAllListeners()
    }
    lastStream = stream
    // captureSettings();

    // grab the formatted messages and also handle errors and such
    stream
      .on('data', handleFormattedMessage)
      .on('end', handleTranscriptEnd)
      .on('error', handleError)

    // when errors occur, the end event may not propagate through the helper streams.
    // However, the recognizeStream should always fire a end and close events
    stream.recognizeStream.on('end', () => {
      if (recordState.error) {
        handleTranscriptEnd()
      }
    })

    // grab raw messages from the debugging events for display on the JSON tab
    stream.recognizeStream
      .on('message', (frame, json) =>
        handleRawMessage({ sent: false, frame, json })
      )
      .on('send-json', json => handleRawMessage({ sent: true, json }))
      .once('send-data', () =>
        handleRawMessage({
          sent: true,
          binary: true,
          data: true, // discard the binary data to avoid waisting memory
        })
      )
      .on('close', (code, message) =>
        handleRawMessage({ close: true, code, message })
      )
  }

  return {
    record(callback, stop) {
      if (stop) {
        stopTranscription()
        return
      }
      recordCallback = callback
      getAccessToken(accessToken => {
        reset()
        recordState.audioSource = 'mic'
        recordState.accessToken = accessToken
        // recordState.speakerLabels = true
        handleStream(recognizeMicrophone(getRecognizeOptions()))
      })
    },
    playFile(file, label, callback, stop) {
      if (stop) {
        stopTranscription()
        return
      }

      recordCallback = callback
      getAccessToken(accessToken => {
        reset()
        recordState.audioSource = 'file'
        recordState.accessToken = accessToken
        // recordState.speakerLabels = false
        recordState.label = label
        handleStreamFile(
          recognizeFile(
            getRecognizeOptions({
              file,
              play: true, // play the audio out loud
              // use a helper stream to slow down the transcript output to match the audio speed
              realtime: true,
            })
          )
        )
      })
    },
  }
}

export default sst
