function displayArray(){
    const arr = []; //Declaring
    let sum = 0;
    let firstLine = "";
    
    for(let i = 0; i < 5; i++){ //Pushing 5 rand valu
        let num = Math.floor(Math.random() * 100);
        sum = sum + num;
        arr.push(num) //Rand num 0-99
    }
    let mean = sum / arr.length;

    let greaterThanArr = []; //Greater than array
    for(let j = 0; j < 5; j++){
        if(arr[j] > mean){
            greaterThanArr.push(arr[j]);
        }
    }

    document.querySelector("p.output").innerHTML = 
    "The array is:" + arr + "<br>" +
    "The mean is:" + mean + "<br>" +
    "Greater Array:" + greaterThanArr


}