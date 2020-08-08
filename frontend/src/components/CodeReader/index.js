import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const style = {
  width: '100%',
  height: '100vh',
  border: 'none',
};

const CodeReader = ({ handleRead }) => {
  const [lastCode, setLastCode] = useState(null);
  
  useEffect(() => {
    const handler = (e) => {
      if (e.origin !== process.env.REACT_APP_HOST_URL || typeof e.data !== 'string') {
        return;
      }

      if (e.data === lastCode) {
        return; 
      }

      handleRead(JSON.parse(e.data));

      setLastCode(e.data);
    };

    window.addEventListener('message', handler);

    return () => window.removeEventListener('message', handler);
  }, [handleRead, setLastCode, lastCode]);

  if (
    !navigator.mediaDevices ||
    typeof navigator.mediaDevices.enumerateDevices !== 'function'
  ) {
    return <p>Cannot use webcam to read codes...</p>;
  }

  return (
    <div>
      <iframe
        style={style}
        title="CodeReader"
        srcDoc={`
        <!doctype html>
        <html lang="en">

        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta name="author" content="ZXing for JS">

          <title>ZXing Decoding from camera stream</title>

          <link rel="stylesheet" rel="preload" as="style" onload="this.rel='stylesheet';this.onload=null"
            href="/zxing/fonts.css">
          <link rel="stylesheet" rel="preload" as="style" onload="this.rel='stylesheet';this.onload=null"
            href="/zxing/normalize.css">
          <link rel="stylesheet" rel="preload" as="style" onload="this.rel='stylesheet';this.onload=null"
            href="/zxing/milligram.min.css">
        </head>

        <body>

          <main class="wrapper" style="padding-top:0">

            <section class="container" id="demo-content" style="margin:0; padding: 0;">
              <div>
                <a class="button" id="startButton">Start</a>
                <a class="button" id="resetButton">Reset</a>
              </div>

              <div>
                <video id="video" width="300" height="200" style="border: 1px solid gray"></video>
              </div>

              <div id="sourceSelectPanel" style="display:none">
                <label for="sourceSelect">Change video source:</label>
                <select id="sourceSelect" style="max-width:400px">
                </select>
              </div>

              <label>Result:</label>
              <pre><code id="result"></code></pre>
            </section>
          </main>

          <script type="text/javascript" src="/zxing/library.min.js"></script>
          <script type="text/javascript">
            window.addEventListener('load', function () {
              let selectedDeviceId;
              const codeReader = new ZXing.BrowserMultiFormatReader()
              codeReader.listVideoInputDevices()
                .then((videoInputDevices) => {
                  const sourceSelect = document.getElementById('sourceSelect')
                  selectedDeviceId = videoInputDevices[0].deviceId
                  if (videoInputDevices.length >= 1) {
                    videoInputDevices.forEach((element) => {
                      const sourceOption = document.createElement('option')
                      sourceOption.text = element.label
                      sourceOption.value = element.deviceId
                      sourceSelect.appendChild(sourceOption)
                    })

                    sourceSelect.onchange = () => {
                      selectedDeviceId = sourceSelect.value;
                    };

                    const sourceSelectPanel = document.getElementById('sourceSelectPanel')
                    sourceSelectPanel.style.display = 'block'
                  }

                  document.getElementById('startButton').addEventListener('click', () => {
                    codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
                      if (result) {
                        document.getElementById('result').textContent = result.text
                        window.top.postMessage(
                          JSON.stringify({
                            error: false,
                            message: result.text
                          }),
                          '*'
                        );
                      }
                      if (err && !(err instanceof ZXing.NotFoundException)) {
                        document.getElementById('result').textContent = err
                      }
                    })
                  })

                  document.getElementById('resetButton').addEventListener('click', () => {
                    codeReader.reset()
                    document.getElementById('result').textContent = '';
                  })

                })
                .catch((err) => {
                  console.error(err)
                })
            })
          </script>

        </body>

        </html>
      `}
      />
    </div>
  );
};

CodeReader.propTypes = {
  handleRead: PropTypes.func.isRequired,
};

export default CodeReader;
