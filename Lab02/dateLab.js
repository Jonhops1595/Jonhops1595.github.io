const months = ["January", "February", "March", "April", 
"May", "June", "July", "August", "September", "October", 
"November", "December"];

const date = new Date();

function getFormatedDate(){
    let dateMessage = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
    
    return "The date today is: " + dateMessage;
}

function getFormatedTime(){
    let time = "";
    let end = "";

    //Adding Hour
    if(document.getElementById('hours').value == 0){ //If 12 hours is selected
        time = date.getHours();
        if(time > 12){
            time = time - 12;
            end = "PM"
            time = time + ":";
        }
        else if (time == 12){
            end = "PM"
            time = time + ":";
        }
        else{
            end = "AM";
            time = time + ":";
        }
    }
    else{
        time = date.getHours() + ":";
    }

    //Adding Minutes
    let minutes = date.getMinutes();
    if(minutes < 10){
        minutes = "0" + minutes;
    }
    time = time + minutes + " " + end;    
    return "The current time is " + time;
}


function displayAlert(){
    let formatedDate = getFormatedDate();
    let formatedTime = getFormatedTime();
    alert(formatedDate + "\n" + formatedTime); 
}


function displayDate(){
    let formatedDate = getFormatedDate();
    let formatedTime = getFormatedTime();
    document.querySelector("p.output").innerHTML = formatedDate + "<br>" + formatedTime;
}


