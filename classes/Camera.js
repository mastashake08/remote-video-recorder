import Webcam from 'webcam-easy';

class Camera extends Webcam {
    #constraints = {};
    #mediaTracks = new Map();
    constructor(
        webcamElement,
        canvasElement = null, 
        snapSoundElement = null, 
        constraints = {
            video: {
              facingMode: {exact: 'user'},
              advanced: [
                {aspectRatio: 16/9, height: 1080, resizeMode: "none"},
                {aspectRatio: 4/3, width: 1280, resizeMode: "none"}
              ]
            },
            audio: false
          }) {
                super(webcamElement, constraints.video.facingMode, canvasElement , snapSoundElement);
                this.mediaConstraints(constraints);
    }

    /* Get media constraints */
    get mediaConstraints() {
        return this.#constraints;
    }

    set mediaConstraints(constraints) {
        try {
            this.#constraints = constraints;
            return this.mediaConstraints();
        } catch (error) {
            console.log(error)  
        }
    }

    /*
      1. Get permission from user
      2. Get all video input devices info
      3. Select camera based on facingMode 
      4. Start stream
    */
      async start(startStream = true) {
        return new Promise((resolve, reject) => {         
          this.stop();
          navigator.mediaDevices.getUserMedia(this.mediaConstraints()) //get permisson from user
            .then(stream => {
              this._streamList.push(stream);
              this.info() //get all video input devices info
                .then(webcams =>{
                  this.selectCamera();   //select camera based on facingMode
                  if(startStream){
                      this.stream()
                          .then(facingMode =>{
                              resolve(this._facingMode);
                          })
                          .catch(error => {
                              reject(error);
                          });
                  }else{
                      resolve(this._selectedDeviceId);
                  }
                }) 
                .catch(error => {
                  reject(error);
                });
            })
            .catch(error => {
                reject(error);
            });
        });
      }

      applyConstraints(streamTrack, constraints) {
        streamTrack.applyConstraints(constraints)
        return streamTrack.getConstraints
      }

      getTracks() {
        for(let stream in this._streamList) {
            this.#mediaTracks.set(stream, stream.getTracks());
        }
        return this.#mediaTracks.entries();
      }



}

export {
    Camera
}