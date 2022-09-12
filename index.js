var axios = require('axios');
require('dotenv').config()
//var fs = require('fs').promises;
var fs = require('fs');

const MONITOR_API = '/events/asr_monitoring_events/monitor'
const UPLOAD_API = '/upload/asr-audio-stream/'

const URL_DOMAIN = process.env.MONITORING_URL_DOMAIN || '==URL OF THE API=='
const API_STAGE = process.env.MONITORING_API_STAGE || '==API_STAGE=='
const API_KEY = process.env.MONITORING_API_KEY || '==TEST_API_KEY=='
const TMP_DIR = process.env.MONITORING_TMP_DIR || '==tmp=='

class StreamingASRMonitor {
  constructor() {
    this.filePath = [];
    this.monitorEvent = {};
  }

  addFilepath(filePath) {
    this.filePath.push(filePath);
  }

  addMonitorEvent(monitorEvent) {
    this.monitorEvent = monitorEvent;
  }


  async uploadEventData() {
    var config = {
      method: 'post',
      url: URL_DOMAIN + API_STAGE + MONITOR_API,
      headers: { 
        'x-api-key': API_KEY, 
        'Content-Type': 'application/json'
      },
      data : JSON.stringify(this.monitorEvent)
    };

    return axios(config)
    .then(function (response) {
      console.log('Response from Event API', response.status, JSON.stringify(response.data));
      if (response.status == 200) {
        return new Promise((resolve) => {
          resolve({'status': 'success', "status": response.status});
        });    
      } else {
        return new Promise((resolve) => {
          resolve({'status': 'failure', "status": response.status});
        });
      }
    })
    .catch(function (error) {
      console.log(error);
      return new Promise((resolve) => {
        resolve({'status': 'failure', 'reason': 'Exception in Event API'});
      });
    });
  }


  async uploadAudioData() {
    var audioContent = null;
    //console.log("=========",this.filePath, !this.filePath);
    try {
    audioContent = fs.createReadStream(this.filePath[0]);
    }
    catch (err){
      return {'status': 'failure', 'error': err.code, 'comment': 'Audio Uploadfailed/Skipped', 'filename':this.filePath}
    }


    const uploadURL = URL_DOMAIN + API_STAGE + UPLOAD_API + this.monitorEvent['audioFileName'];
    console.log('AUDIO URL', uploadURL)
    var config = {
      method: 'put',
      url: uploadURL,
      headers: { 
        'x-api-key': API_KEY, 
        'Content-Type': 'audio/wave'
      },
      data : audioContent
    };

    return axios(config)
    .then(function (response) {
      console.log('Response from Upload API', response.status, JSON.stringify(response.data));
      if (response.status == 200) {
        return new Promise((resolve) => {
          resolve({'status': 'success', "status": response.status});
        });    
      } else {
        return new Promise((resolve) => {
          resolve({'status': 'failure', "status": response.status});
        });
      }
    })
    .catch(function (error) {
      console.log(error);
      return new Promise((resolve) => {
        resolve({'status': 'failure', 'reason': 'Exception in Upload API'});
      });
    });   

  }

  async upload(callback) {

    console.log("Data", this.filePath, this.monitorEvent)
    const uploadEventData = this.uploadEventData.bind(this);
    return this.uploadAudioData().then(function(responseOnAudio){
      console.log("UPLOAD AUDIO DATA OUTPUT", responseOnAudio)
      return uploadEventData().then(function(responseOnEvent){
        console.log("UPLOAD EVENT DATA OUTPUT:", responseOnEvent);
        return new Promise((resolve) => {
          const response = {'status': 'success', 'comment': 'Data and audio uploaded', 'audio':responseOnAudio,'data':responseOnEvent}
          resolve({'status': 'success', 'comment': 'Data and audio uploaded', 'audio':responseOnAudio,'data':responseOnEvent})
          if (callback) {
            callback();
          }
        })
      });
    });
  }

}

module.exports = StreamingASRMonitor
