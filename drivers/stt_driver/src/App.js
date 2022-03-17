import React from 'react';
const parts = window.location.href.replace("http://","").replace("https://","").split(":");
const wsurl = `ws://${parts[0]}:${parts[1]}`;
const socket = new WebSocket(wsurl);

const DOWNSAMPLING_WORKER = './downsampling_worker.js';
let recordingInterval;
let audioContext;
let mediaStream;
let processor;
let mediaStreamSource ;

function App(props)  {

	const [connected, setConnected] = React.useState(false);
	const [recording, setRecording] = React.useState(false);
	const [recordingStart, setRecordingStart] = React.useState(0);
	const [recordingTime, setRecordingTime] = React.useState(0);
	const [recognitionOutput, setRecognitionOutput]= React.useState("");

	React.useEffect(()=>{
		try{
            socket.onopen = function (event) {
              console.log("successfully opened socket!");
			  setConnected(true);
            };
          }catch(err){
            console.log("error opening socket!");
          }
        try{ 
			socket.onmessage = function(evt) {
           		try{
					const {text} = JSON.parse(evt.data);
					setRecognitionOutput(text);
				}catch(err){

				}
         	};
         	socket.onerror = function(evt) {
            	console.log("error",evt);
         	};

        }catch(err){
            console.log(err);
        }
	},[])
	
	const renderRecognitionOutput = ()=>{
		return (<div style={{width:"100vw", height:"calc(100vh - 20px)", display:"flex", alignItems:"center", justifyContent:"center"}}>
			<div style={{fontSize:"3em", padding:20}}>{recognitionOutput}</div>
		</div>)
	}
	
	const createAudioProcessor = (audioContext, audioSource)=>{

		let _processor = audioContext.createScriptProcessor(4096, 1, 1);
		const sampleRate = audioSource.context.sampleRate;
		
		let downsampler = new Worker(DOWNSAMPLING_WORKER);
		downsampler.postMessage({command: "init", inputSampleRate: sampleRate});
		downsampler.onmessage = (e) => {
			try{
				socket.send(e.data.buffer);
			}catch(err){
				console.log(err);
			}
		};
		
		_processor.onaudioprocess = (event) => {
			var data = event.inputBuffer.getChannelData(0);
			downsampler.postMessage({command: "process", inputFrame: data});
		};
		
		_processor.shutdown = () => {
			_processor.disconnect();
			_processor.onaudioprocess = null;
		};
		
		_processor.connect(audioContext.destination);
		
		return _processor;
	}
	
	const startRecording = e => {
		if (!recording) {
			recordingInterval = setInterval(() => {
				let recordingTime = new Date().getTime() - recordingStart;
				setRecordingTime(recordingTime);
			}, 100);
			
			setRecording(true);
			setRecordingStart(new Date().getTime())
			setRecordingTime(0);
			startMicrophone();
		}
	};
	
	const startMicrophone = ()=>{
		
		audioContext = new AudioContext();
		
		const success = (stream) => {
			mediaStream = stream;
			mediaStreamSource = audioContext.createMediaStreamSource(stream);
			processor = createAudioProcessor(audioContext, mediaStreamSource);
			mediaStreamSource.connect(processor);
		};
		
		const fail = (e) => {
			console.error('recording failure', e);
		};
		
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices.getUserMedia({
				video: false,
				audio: true
			})
			.then(success)
			.catch(fail);
		}
		else {
			navigator.getUserMedia({
				video: false,
				audio: true
			}, success, fail);
		}
	}
	
	const stopRecording = e => {
		if (recording) {
			if (socket.connected) {
				socket.emit('stream-reset');
			}
			clearInterval(recordingInterval);
			setRecording(false);
			stopMicrophone();
		}
	};
	
	const stopMicrophone = ()=>{
		if (mediaStream) {
			mediaStream.getTracks()[0].stop();
		}
		if (mediaStreamSource) {
			mediaStreamSource.disconnect();
		}
		if (processor) {
			processor.shutdown();
		}
		if (audioContext) {
			audioContext.close();
		}
	}


	return (<div className="App">
			<div>
				<button disabled={!connected || recording} onClick={startRecording}>
					Start Listening
				</button>
				
				<button disabled={!recording} onClick={stopRecording}>
					Stop Listening
				</button>
			</div>
			{renderRecognitionOutput()}
		</div>);
}

export default App;
