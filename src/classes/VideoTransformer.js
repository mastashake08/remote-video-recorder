class VideoTransformer extends TransformStream {
    #trackProcessor = null;
    #trackGenerator = null;
    #transformContent = {
        async transform(videoFrame, controller) {
            const newFrame = videoFrame.clone();
            console.log(newFrame)  
            videoFrame.close();
            controller.enqueue(newFrame);
        },
      };

    constructor(videoTrack, cb = this.#transformContent) {
        
        super({ ...cb});
        const { trackProcessor, trackGenerator } = this.createTrack(videoTrack)
        this.#trackProcessor = trackProcessor;
        this.#trackGenerator = trackGenerator;
        this.#transformContent = cb;
        this.startTransform();
    }

    createTrack(videoTrack) {

        const trackProcessor = new MediaStreamTrackProcessor({ track: videoTrack });
        const trackGenerator = new MediaStreamTrackGenerator({ kind: 'video' });
        return {
            trackProcessor,
            trackGenerator
        }

    }
    startTransform() {
        this.#trackProcessor.readable
        .pipeThrough(this)
        .pipeTo(this.#trackGenerator.writable);
    }

    getTrack() {
        return this.#trackGenerator
    }



}

export {
    VideoTransformer
}