// In this custom Detection Users have choice to select which exercise to do also end button is there to stop the working .

// we have four exercises...

// Squarts, Lunges, Leg Raise , Push Ups, Bending Toe Touch

// This is only  Counter Based.

// Custom Working Based.
let poseNet;
let model1;
let model2;
let model3;
let model4;
let model5;
let currentModel;
let switchInterval = 250; // Switch interval in milliseconds
let currentLabel = '';
let isClassifying = true; // Flag to control classification
let video;
let skeleton;
let pose;
let totalCountsNeeded = 30;
let GlobalBool = false;
let indexPosture=10;
const Postures = {
    '0': "No Posture",
    '1': "Squats",
     '3': "Lunges",
    '2': "Leg Raiser",
    '4': "Push Ups",
    '5': "Bending Toe Touch",

};
let val=10  ;
let currentPos = 'a';


let currPoseCount = 0;
let index = 0;

let timer = 250;
let flag = false;
let selectedPosture = '0';


function changePostureModel() {




    poseInfoDiv.html(`CurrenntPosture: ${Postures[selectedPosture]}<br>Pose Counter: 0`);
    currPoseCount = 0;

    flag = false;
    selectedPosture = document.getElementById("postureSelect").value;
    if (selectedPosture !== "") {
        switchModels();
    }
}
function  endPosture(){
    poseInfoDiv.html(`CurrentPosture: No Posture Selected<br>Pose Counter: 0`);
    flag = false;
    alert("You have stopped the exercise  , Select New Exercise to restart");
}

function  Start(){
    // Dhananjay can Do anything he wants to do.
}
function  Stop(){

    poseInfoDiv.html(`CurrentPosture: No Posture Selected<br>Pose Counter: 0`);
    flag = false;
    document.getElementById("postureSelect").value = "Select One Posture";
    alert("You have stopped the exercise  , Select New Exercise to restart");

}


    function setup() {
        // Create a poseNet instance


        poseNet = ml5.poseNet();

       // Create neural network instances
        model1 = ml5.neuralNetwork();
        model2 = ml5.neuralNetwork();
        model3 = ml5.neuralNetwork();
        model4=  ml5.neuralNetwork();
        model5=  ml5.neuralNetwork();


        currentModel = model1; // Start with the first model


        const folderName1 = 1;
        // This is Squart Position
        const modelInfo1 = {
            model: `Exercise-Postures-Custom/Models/model.json`,
            metadata: `Exercise-Postures-Custom/Models/model_meta.json`,
            weights: `Exercise-Postures-Custom/Models/model.weights.bin`,
        };
        model1.load(modelInfo1, modelLoaded);

        const folderName2 = 2;
        //This is The Leg Raise Posture,
        const modelInfo2 = { // this loads the LegRaise Posture.

            model: `Exercise-Postures-Custom/Models/legraise.json`,
            metadata: `Exercise-Postures-Custom/Models/legraise_meta.json`,
            weights: `Exercise-Postures-Custom/Models/legraise.weights.bin`,

        };
        model2.load(modelInfo2, modelLoaded);

     // This is the Lunges Exercise.
        const modelInfo3 = {  // This is Lunges.
            model: `Exercise-Postures-Custom/Models/model_lunges.json`,
            metadata: `Exercise-Postures-Custom/Models/model_lunges_meta (6).json`,
            weights: `Exercise-Postures-Custom/Models/model_lunges.weights (14).bin`,
        };
        model3.load(modelInfo3, modelLoaded);


        // This is Push-Ups Exercise
        const  modelInfo4={
            model: `Exercise-Postures-Custom/Models/pushups.json`,
            metadata: `Exercise-Postures-Custom/Models/pushups_meta.json`,
            weights: `Exercise-Postures-Custom/Models/pushups.weights.bin`,
        };
        model4.load(modelInfo4,modelLoaded);

        // This is Knee Touch Detection.

        const modelInfo5={
            model: `Exercise-Postures-Custom/Models/kneetouch.json`,
            metadata: `Exercise-Postures-Custom/Models/kneetouch_meta.json`,
            weights: `Exercise-Postures-Custom/Models/kneetouch.weights.bin`,
        };
        model5.load(modelInfo5,modelLoaded);





        video = createCapture(VIDEO);
        video.size(640, 480);

        video.hide();

        // Set up the canvas for pose detection
        const poseCanvas = createCanvas(640, 480);


        poseNet = ml5.poseNet(video, () => {
            console.log("Model Ready to so");
        });
        // Listen for pose events
        poseNet.on('pose', (results) => {
            if (results.length > 0) {
                pose = results[0]["pose"];
                skeleton = results[0].skeleton;
            }
        });
        poseInfoDiv = createDiv();
        poseInfoDiv.style('background-color', 'blue');
        poseInfoDiv.style('color', 'white');
        poseInfoDiv.style('padding', '10px');
        poseInfoDiv.style('text-align', 'center');
        poseInfoDiv.style('font-size', '24px'); // Adjust the font size
        poseInfoDiv.style('font-weight', 'bold'); // Make the text bold
        poseInfoDiv.style('margin-top', '20px');

        // Set a timer to switch models after a certain interval

    }


    function draw() {
        // Display the video feed on the canvas
        push();
        translate(video.width, 0);
        scale(-1, 1);
        image(video, 0, 0, video.width, video.height);

        // Draw poses on the canvas
        drawPose();

        // Classify the pose using the neural network


        // Display information on the canvas
        fill(255);
        textSize(24);
        textAlign(CENTER, TOP);
        text(`Current Pose: ${currentLabel}`, 10000, 100);
        text(`Pose Timer: ${switchInterval / 1000}`, width / 2, 50);
    }

    function drawPose() {


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

        // First Implement the squart posture.
        //
        // if(totalCountsNeeded===currPoseCount){
        //     flag=false;
        // }

        // here we dont

        if (flag) {  // initally flag is false. Classification Works Only when Classification works.

            if (isClassifying && pose) {

                // if (timer <= 0) {
                //     flag = false;
                // }

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

        }

        // else {
        //
        //     flag = false;
        //     switchModels();
        //     flag = true;
        // }
        //
    }

    function gotResult(error, results) {


        if (error) {
            console.error(error);
            isClassifying = true; // Re-enable classification on error
            return;
        }

        // Get the current label from the classification results
        if(results[0].confidence>0.70) {
            currentLabel = results[0].label;
            console.log(currentLabel);

            if (currentLabel === 'a' && currentPos === 'a') {
                // User is in standing ,
                // now needs to go to bending.

                // this can be used with anything ,

                if (GlobalBool) {
                    // initally false will be set true by bending.
                    currPoseCount++;
                    GlobalBool = false;
                }
                currentPos = 'b'; // he needs to do bending.

            } else if (currentLabel === 'b' && currentPos === 'b') {
                // did bending now standing.
                currentPos = 'a';
                GlobalBool = true;
            }

            if (currentPos
            )
                poseInfoDiv.html(`Current Pose: ${Postures[selectedPosture]}<br>Pose Counter: ${currPoseCount}`);


            setTimeout(() => {
                isClassifying = true;
                classifyPose();
            }, 400);
        }
        else{
          setTimeout(classifyPose,100);
        }

    }// Re-enable classification after processing results


    function switchModels() {


        flag = false;
        if(selectedPosture!=='0'){
            if (selectedPosture === '1') {
                currentModel = model1;
                console.log("Switched to model-1")
            } else if (selectedPosture === '2') {
                currentModel = model2;
                console.log("Switched to model-2");
            } else if (selectedPosture === '3') {
                currentModel = model3;
                console.log("Switched to model-3");
            }
            else  if(selectedPosture==='4'){
                currentModel=model4;
                console.log("Switched to model-4");
            }
            else if(selectedPosture==='5'){
                currentModel=model5;
                console.log("Switched to model-5");
            }
            flag = true;
            isClassifying = true;
            classifyPose();
        }

        // Re-enable classification after the switch

        }






function modelLoaded() {
    console.log('Neural Network Model Loaded!');
    classifyPose();

}



