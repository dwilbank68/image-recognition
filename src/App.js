import React, { useEffect, useRef, useState} from 'react';
import GaugeChart from './GaugeChart.jsx';
import ml5 from 'ml5';
import useInterval from './useInterval.js';
import './App.css';

let classifier;

function App() {
    const videoRef = useRef();
    const [gaugeData, setGaugeData] = useState([0.5, 0.5]);
    const [shouldClassify, setShouldClassify] = useState(false);

    useEffect(() => {
        classifier = ml5.imageClassifier('./my-model/model.json', () => {
            navigator.mediaDevices
                .getUserMedia({video:true, audio:false})
                .then(stream => {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                });
        });
    },[])

    useInterval(() => {
        if (classifier && shouldClassify) {
            classifier.classify(videoRef.current, (err, results) => {
                if (err) {console.log(err); return;}
                results.sort((a,b) => b.label.localeCompare(a.label));
                setGaugeData(results.map(entry => entry.confidence));
            })
        }
    }, 500);

    return (
        <React.Fragment>
            <h1>Is Someone There?</h1>

            <small>
                [{gaugeData[0].toFixed(2)}, {gaugeData[1].toFixed(2)}]
            </small>

            <GaugeChart data={gaugeData}/>
            <button onClick={() => setShouldClassify(!shouldClassify)}>
                {shouldClassify ? "Stop Classifying" : "Start Classifying"}
            </button>
            <video  ref={videoRef}
                    style={{transform: 'scale(-1, 1)'}}
                    width="300"
                    height="150"/>
        </React.Fragment>
    );
}

export default App;
