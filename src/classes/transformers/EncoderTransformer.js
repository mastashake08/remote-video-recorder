class EncoderTransformer extends VideoEncoder {
    
    #init = {
        output: this.handleChunk,
        error: (e) => {
          console.log(e.message);
        },
      }
    #encoderConfig = {
        codec : 'vp8',
        tuning: {
          bitrate: 1_000_000,
          framerate: 24,
          width: 1024,
          height: 768
        }
      }};

      #encoder = null;
      #transformer = {
        start(controller) {
          // Skipped: a few per-frame parameters
          this.encodedCallback = null;
          this.#encoder  = new VideoEncoder({
            output: (chunk, metadata) => {
              if (metadata.decoderConfig) {
                // Serialize decoder config as chunk
                const decoderConfig = JSON.stringify(metadata.decoderConfig);
                const configChunk = {
                  decode: decoderConfig
                 };
                controller.enqueue(configChunk);
              }
              // Skipped: increment per-frame parameters
              if (this.encodedCallback) {
                this.encodedCallback();
                this.encodedCallback = null;
              }
              controller.enqueue(chunk);
            },
            error: e => { console.error(e); }
          });
          VideoEncoder.isConfigSupported(this.#encodeConfig)
            .then(encoderSupport => {
              // Skipped: check that config is really supported
              this.#encoder.configure(encoderSupport.config);
            })
        },
        transform(frame, controller) {
          // Skip: check encoder state
          // encode() runs async, resolve transform() promise once done
          return new Promise(resolve => {
            this.encodedCallback = resolve;
            // Skipped: check need to encode frame as key frame
            this.#encoder.encode(frame, { … });
            frame.close();
          });
        }
      }
    
    constructor(init = this.#init, config = this.#encoderConfig) {
        super(init);
        this.configure(config)
    }
}

export {
    Encoder
}