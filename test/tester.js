const assert = require('assert').strict;
var uuid = require('uuid');
const StreamingASRMonitor = require('../index')
const fs = require('fs');

const id = "test-" + uuid.v4();
const audioFileName = id + '.wav';

const rawData = fs.readFileSync('test/test.json')

const data = JSON.parse(rawData)

data['id'] = id;
data['audioFileName'] = audioFileName;

        let streamingASRMonitor  = new StreamingASRMonitor();
        //const expectedError = new Error("You have no TODOs stored. Why don't you add one first?");
        //streamingASRMonitor.addFilepath('test/test.wav')
        streamingASRMonitor.addFilepath(null);
        streamingASRMonitor.addMonitorEvent(data)

        streamingASRMonitor.upload().then(function(response){
            console.log("DONE :: ", response)
        })
    
