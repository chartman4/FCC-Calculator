// assumes a valid array of operands and operations
// returns a calculated value and a message of success or error
export function calculate(arr) {
    var message;
    if (arr.length === 1) {
        return { value: arr[0], message: "success" };
    } else {
        message = performMulDiv(arr);
    }

    // if multiplication and division loop didn't cause
    // error, perform addition and substractions
    if (message === "success") {
        message = performAddSub(arr);
    }

    return { value: arr[0], message: message };
}

// used to go through user entry and perform multiplication and division
function performMulDiv(arr) {
    var index = 0;
    var value = 0;
    var divisor;
    var message = "success";

    // run through for multiplication and division
    while (index < arr.length) {
        // if item is multiplication get number previous and after and perform multiplication and 
        // replace them in the numbers array  
        if (arr[index] === "*") {
            value = parseFloat(arr[index - 1]) * parseFloat(arr[index + 1]);
            value = (value * 10000).toFixed(4) / 10000
            console.log(value);
            arr.splice(index - 1, 3, value);
            index -= 1;

            // if item is division get number previous and after and perform division and 
            // replace them in the numbers array
        } else if (arr[index] === "/") {
            divisor = parseFloat(arr[index + 1]);
            // can't divide by zero
            if (divisor === 0) {
                // can't divide by zero
                return "infinity";
                // all good
            } else {
                value = parseFloat(arr[index - 1]) / divisor;
                value = (value * 10000).toFixed(4) / 10000
                arr.splice(index - 1, 3, value);
                index -= 1;
            }
        }
        index += 1;
    }
    return message;
}

// used to go through user entry and perform adding and subtraction
// done after performMulDiv
function performAddSub(arr) {
    var index = 0;
    var message = "success";
    var value = 0;

    // run through for subtraction and addition
    while (index < arr.length) {
        // if item is addition get number previous and after and perform addition and 
        // replace them in the numbers array  
        if (arr[index] === "+") {
            value = parseFloat(arr[index - 1]) + parseFloat(arr[index + 1]);
            value = (value * 10000).toFixed(4) / 10000
            arr.splice(index - 1, 3, value);
            index--;
            // do the same if it is subtraction, only do subtraction
        } else if (arr[index] === "-") {
            value = parseFloat(arr[index - 1]) - parseFloat(arr[index + 1]);
            value = (value * 10000).toFixed(4) / 10000
            arr.splice(index - 1, 3, value);
            index -= 1;
        }
        index += 1;

    }
    return message;

}