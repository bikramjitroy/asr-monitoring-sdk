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

describe("upload()", function() {
    it("Uploads event data and audio file", async function() {
        this.timeout(20000);
        let streamingASRMonitor  = new StreamingASRMonitor();
        //const expectedError = new Error("You have no TODOs stored. Why don't you add one first?");
        streamingASRMonitor.addFilepath('test/test.wav')
        streamingASRMonitor.addMonitorEvent(data)

        await streamingASRMonitor.upload((cb) => {
          //assert.strictEqual(, true);
          done(cb);
        });
    });
});
