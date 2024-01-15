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
    
    constructor(init = this.#init, config = this.#encoderConfig) {
        super(init);
        this.configure(config)
    }
}

export {
    Encoder
}