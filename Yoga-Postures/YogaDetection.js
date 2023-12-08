let poseNet;
let model1;
let model2;

let checkerr = true;
let musicStarted=false;
let model6;
let currentModel;
let switchInterval = 250; // Switch interval in milliseconds
let currentLabel = '';
let isClassifying = true; // Flag to control classification
let video;
let skeleton;
let pose;
let totalCountsNeeded = 3;
let GlobalBool = false;
let index = 0;
const Postures = {
    '0': "Tree-Posture",
    '1': "Warrior-Posture",
    '2': "Dog Posture",
    '3': "Mountain",
    '4': "Chair Posture",
    '5': "All Exercises Completed",


};
const array = ['a', 'v', 'c', 'd', 'e'];
let indexOfCurrentPosture = 0;



let currentPos = "NO Posture";


let currPoseCount = 3;  // User should stand in this position to complete the step
let yogaDetection = 0;

let sound;


let flag = true;
function preload(){
    sound=createAudio('Yoga-Postures/Chill - Cool Down Harmony.mp3');
}



function Start(){
    console.log("We are Starting");
    flag=true;
}
function  Stop(){
    console.log("Detection Stopped");
    flag=false;
}
function setup() {




    poseNet = ml5.poseNet();

    // Create neural network instances
    model1 = ml5.neuralNetwork();
    model2 = ml5.neuralNetwork();

    currentModel = model1;


    // @Dhananjay  Add Here the code to put image of Tree Posture which is the first posture.





    const modelInfo1 = {
        model: `Yoga-Postures/Models/model (9).json`,
        metadata: `Yoga-Postures/Models/model_meta (8).json`,
        weights: `Yoga-Postures/Models/model.weights (16).bin`,
    };
    model1.load(modelInfo1, modelLoaded); // this loads the squarts posture.


    video = createCapture(VIDEO);
    video.size(640, 480);

    video.hide();

    // Set up the canvas for pose detection
    const poseCanvas = createCanvas(640, 480);


    poseNet = ml5.poseNet(video, () => {
        console.log("MOdel Ready to so");
    });

    poseNet.on('pose', (results) => {
        if (results.length > 0) {
            pose = results[0]["pose"];
            skeleton = results[0].skeleton;
        }

    });

    // @ Dhananjay You Can Remove the below and give your styles.
    backgroundMusic = document.getElementById('backgroundMusic');
    poseInfoDiv = createDiv();
    poseInfoDiv.style('background-color', 'blue');
    poseInfoDiv.style('color', 'white');
    poseInfoDiv.style('padding', '10px');
    poseInfoDiv.style('text-align', 'center');
    poseInfoDiv.style('font-size', '24px');
    poseInfoDiv.style('font-weight', 'bold');
    poseInfoDiv.style('margin-top', '20px');
    poseInfoDiv.html(`Current Pose: ${Postures[indexOfCurrentPosture]}<br>Pose Timer: ${currPoseCount}`);




}


function draw() {

    push();
    translate(video.width, 0);
    scale(-1, 1);
    image(video, 0, 0, video.width, video.height);


    drawPose();




    fill(255);
    textSize(24);
    textAlign(CENTER, TOP);
    // text(`Current Pose: ${currentLabel}`, 10000, 100);
    // text(`Pose Timer: ${switchInterval / 1000}`, width / 2, 50);
}

function playMusic() {

    backgroundMusic.play();
}

function stopMusic() {

    backgroundMusic.pause();

    backgroundMusic.currentTime = 0;
}

function drawPose() {
    if (!musicStarted) {
        backgroundMusic.play();
        musicStarted = true; // Set the flag to true to avoid restarting the music
    }

    if (pose) {


        for (let i = 0; i < skeleton.length; i++) {
            let a = skeleton[i][0];
            let b = skeleton[i][1];
            strokeWeight(8);
            stroke(244, 194, 194);
            line(a.position.x, a.position.y, b.position.x, b.position.y);
        }
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            fill(0);
            stroke(255);
            ellipse(x, y, 16, 16);
        }
    }
    pop();

}

function gotPoses(results) {

}

function classifyPose() {



    if (indexOfCurrentPosture === 5) {
        console.log("Hello");
        checkerr = false;

        return;
    }
    if (currPoseCount === 0 && checkerr) {
        console.log("Done Couneiig");
        checkerr=false;

       sound.play();
       flag=false;
       backgroundMusic.pause();
        setTimeout(()=>{
          sound.stop();
            currPoseCount = 5;
            backgroundMusic.play();
            indexOfCurrentPosture++;
            flag=true;
            checkerr=true;
        },5000);



        // Dhananjay You can add Here the Code to put new text and Image on the page since we are moving to next model.

    }

    if (flag && checkerr) {




        if (isClassifying && pose) {


            isClassifying = false; // Disable classification during the switch

            let inputs = [];

            for (let i = 0; i < pose.keypoints.length; i++) {
                let x = pose.keypoints[i].position.x;
                let y = pose.keypoints[i].position.y;
                inputs.push(x);
                inputs.push(y);
            }

            currentModel.classify(inputs, gotResult);

        } else {
            setTimeout(() => {
                isClassifying = true; // Re-enable classification
                classifyPose();
            }, 100);
        }

    } else {

        setTimeout(()=>{
            classifyPose();
        },100);


    }

}

function gotResult(error, results) {


    if (error) {
        console.error(error);
        isClassifying = true;
        return;
    }



    if (results[0].confidence > 0.70) {
        currentLabel = results[0].label;
        console.log(currentLabel);

        if (currentLabel === array[indexOfCurrentPosture]) {
            currPoseCount--;

        }


         poseInfoDiv.html(`Current Pose: ${Postures[indexOfCurrentPosture]}<br>Pose Timer: ${currPoseCount}`);
        setTimeout(() => { // so we wait it 1 sec for next detection.
            isClassifying = true;
            classifyPose();
        }, 1000);

    } else {
        setTimeout(classifyPose, 100);
    }

}



function switchModels() {


    if (currentModel === model1) {
        currentModel = model2;
        console.log('Switched to Model 2');
    } else {
        currentModel = model1;
        console.log('Switched to Model 1');
    }


    flag = true;
    isClassifying = true;
    classifyPose(); // No need

}

function modelLoaded() {
    console.log('Neural Network Model Loaded!');

    classifyPose();
}



