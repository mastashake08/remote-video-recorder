/**
 * Class representing a TransformStream for video frame storage and transformation.
 */
class StoreFrames extends TransformStream {
    #frames;
    #frame_count;
    #transformContent;
    /**
     * Creates an instance of StoreFrames.
     */
    constructor() {
      /**
       * @type {Map<number, VideoFrame>} - A map to store video frames with unique identifiers.
       * @private
       */
      this.#frames = new Map();
  
      /**
       * @type {number} - Counter to keep track of the number of frames.
       * @private
       */
      this.#frame_count = 0;
  
      /**
       * @type {Object} - Object containing methods used by the TransformStream for handling transformation.
       * @property {Function} start - Empty function for setup when the transformation starts.
       * @property {Function} transform - Asynchronously transforms each incoming video frame.
       * @property {Function} flush - Method called when the stream is being closed for cleanup.
       * @private
       */
      this.#transformContent = {
        start() {},
        async transform(videoFrame, controller) {
          /**
           * Clones the video frame for transformation.
           * @type {VideoFrame}
           */
          const newFrame = videoFrame.clone();
          videoFrame.close();
          this.setFrame(newFrame);
  
          /**
           * Dispatches a custom event when a new frame is created.
           * @event StoreFrames#new-frame-created
           * @type {CustomEvent}
           * @property {Object} detail - Custom event details.
           * @property {VideoFrame} detail.frame - The newly created frame.
           */
          this.dispatchEvent(new CustomEvent('new-frame-created', {
            bubbles: true,
            detail: {
              frame: newFrame,
            },
          }));
  
          // Enqueues the new frame using the controller.
          controller.enqueue(newFrame);
        },
        flush() {
          /* do any destructor work here */
          this.framesImported();
        },
      };
  
      // Calls the constructor of the superclass with methods from #transformContent.
      super({ ...this.#transformContent });
    }
  
    /**
     * Gets the map of stored video frames.
     * @returns {Map<number, VideoFrame>} - A map of video frames.
     */
    getFrames() {
      return this.#frames;
    }
  
    /**
     * Sets a new video frame in the map with a unique identifier.
     * @param {VideoFrame} newFrame - The new video frame to be stored.
     */
    setFrame(newFrame) {
      this.#frames.set(this.#frame_count, newFrame);
      this.#frame_count++;
    }
  
    /**
     * Dispatches a custom event when frames creation is done.
     * @emits StoreFrames#frames-creation-done
     */
    framesImported() {
      this.dispatchEvent(new CustomEvent('frames-creation-done', {
        bubbles: true,
        detail: {
          frames: this.getFrames(),
        },
      }));
    }
  }
  
  export {
    StoreFrames
  };
  