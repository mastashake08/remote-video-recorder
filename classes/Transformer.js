class Transformer {
    #trackProcessor = null;
    #trackGenerator = null;
    #transformer;
    constructor(videoTrack) {
        this.#trackProcessor = new MediaStreamTrackProcessor({ track: videoTrack });
        this.#trackGenerator = new MediaStreamTrackGenerator({ kind: 'video' });
        this.#transformer = new TransformStream({
            async transform(videoFrame, controller) {
                const newFrame = videoFrame.clone();
                console.log(newFrame)  
                videoFrame.close();
                controller.enqueue(newFrame);
            },
          });

    }

}

export {
    Transformer
}