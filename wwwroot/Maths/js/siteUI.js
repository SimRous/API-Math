//<span class="cmdIcon fa-solid fa-ellipsis-vertical"></span>

const tests = [
    ["op=+", "x=-111", "y=-244"],
    ["op=-", "x=1", "y=abc"],
    ["op=p", "n=a"],
    ["op=-", "x=111", "y=244"],
    ["op=*", "x=11.56", "y=244.12345"],
    ["op=/", "x=99", "y=11.06"],
    ["op=/", "x=99", "y=0"],
    ["op=/", "x=0", "y=0"],
    ["op=%", "x=5", "y=5"],
    ["op=%", "x=100", "y=13"],
    ["op=%", "x=100", "y=0"],
    ["op=%", "x=0", "y=0"],
    ["op=!", "n=0"],
    ["op=p", "n=0"],
    ["op=p", "n=1"],
    ["op=p", "n=2"],
    ["op=p", "n=5"],
    ["op=p", "n=6"],
    ["op=p", "n=6.5"],
    ["op=p", "n=113"],
    ["op=p", "n=114"],
    ["op=np", "n=1"],
    ["op=np", "n=30"],
    ["op=+", "X=111", "y=244"],
    ["op=+", "x=111", "Y=244"],
    ["op=+", "x=111", "y=244", "z=0"],
    ["op=!", "n=5", "z=0"],
    ["op=!", "n=5.5"],
    ["z=0"],
    ["op=!", "n=-5"],
    ["x=null"],

];

Init_UI();

function Init_UI() {


    $('#test').on("click", async function () {
        renderTests($('#Url').val());
    });
    $('#help').on("click", async function () {
        await API_GetMathResult([],$('#Url').val())
    });

}

async function renderTests(Url) {
    let numberOfError = {value: 0};
    showWaitingGif();
    $("#title").text("Test du service /api/maths");
    let testsResults = [];
    for (let i = 0; i < tests.length; i++) {
        testsResults.push(await API_GetMathResult(tests[i], Url))
    }
    eraseContent();
    $("#content").append($(`<fieldset id=tests><legend>Tests</legend></fieldset>`));
    if (testsResults !== null) {
        testsResults.forEach(result => {
            $("#tests").append(renderTest(result,getResultState(result,numberOfError)));
        });
    }
    $("#content").append($(`<fieldset id=testsResult><legend>Verdict</legend></fieldset>`));
    $("#testsResult").append($(`<div>${numberOfError.value === 0?"Bravo!!! Aucun problème":"Il y a "+numberOfError.value + " erreurs"}</div>`));
}
function getResultState(result,numberOfError) {
    let errorMessage = '';
    let twoParameterOperators = [' ', '+', '-', '/', '*', '%'];
    let oneParameterOperators = ['!', 'p', 'np'];
    let res = 0;
    let responseJSON;
    let x;
    let y;
    let n;
    if (result.op !== undefined) {

        if (twoParameterOperators.includes(result.op)) {
            if (Object.keys(result).length > 4) {
                errorMessage += "Too many parameters";
            }
            else {
                if (result.x === undefined) {
                    errorMessage += "'x' parameter is missing";
                }
                else if (result.y === undefined) {
                    errorMessage += "'y' parameter is missing";
                }
                else {
                    x = parseInt(result.x);
                    errorMessage = ValidateNumber("x", x, errorMessage);
                    y = parseInt(result.y);
                    errorMessage = ValidateNumber("y", y, errorMessage);

                }
            }
        }
        else if (oneParameterOperators.includes(result.op)) {
            if (Object.keys(result).length > 3) {
                errorMessage += "Too many parameters";
            }
            else {
                if (result.n === undefined) {
                    errorMessage += "'n' parameter is missing";
                }
                else {
                    n = parseInt(result.n);
                    if (n <= 0) {
                        errorMessage += "n parameter must be an integer > 0";
                    }
                    errorMessage = ValidateNumber("n", n, errorMessage);
                }

            }
        }
    }
    else {
        errorMessage += "operator is missing";
    }
    if (errorMessage === '' && res === 0) {
        switch (result.op) {
            case '+':
                res = x + y;
                break;
            case '-':
                res = x - y;
                break;
            case '*':
                res = x * y;
                break;
            case '/':
                res = x / y;
                if (result.x != 0 && result.y == 0)
                    res = "Infinity";
                else if (result.x == 0 && result.y == 0)
                    res = "NaN";
                break;
            case '%':
                res = x % y;
                if (result.y == 0)
                    res = "NaN";
                break;
            case '!':
                res = factorial(n);
                break;
            case 'p':
                res = isPrime(n);
                break;
            case 'np':
                res = findPrime(n);
                break;
            default:
                errorMessage += "'" + result.op + "' operator is not implemented" + " ";
                break;
        }

    }
    if ((errorMessage === '' && result.error === undefined) ||(errorMessage !== '' && result.value === undefined)  )
        return true;
    else{
        numberOfError.value++;
        return false;
    }

}
function renderTest(test, state) {
    return $(`
            <div class="testRow">
                    <div class="testLayout">
                        <span>${state ? "OK": "ERROR"}</span>
                        <span>-----></span>
                        <span>${JSON.stringify(test)}</span>
                    </div>
            </div>          
    `);
}
function renderResult(){
    return $(`
        <div class="testRow">
                <div class="testLayout">
                    <span>${state ? "OK": "ERROR"}</span>
                    <span>-----></span>
                    <span>${JSON.stringify(test)}</span>
                </div>
        </div>          
`);
}
function renderHelp(){
    return $(`
    <fieldset>
    <legend>Aide</legend>
        <h1>GET : Maths endpoints</h1>
    <h1>List of possible query strings:</h1>
    <hr>
        <h2 class="endpoints">
            <span>?op=+&x=[number]&y=[number]</span> <br>
            <span>return{"op":"+","x":number,"y":number,"value":x+y}</span>
            <span></span>
            <br> <br>
            <span>?op=-&x=[number]&y=[number]</span> <br>
            <span>return{"op":"-","x":number,"y":number,"value":x-y}</span>
            <span></span>
            <br> <br>
            <span>?op=*&x=[number]&y=[number]</span> <br>
            <span>return{"op":"*","x":number,"y":number,"value":x*y}</span>
            <span></span>
            <br> <br>
            <span>?op=/&x=[number]&y=[number]</span> <br>
            <span>return{"op":"/","x":number,"y":number,"value":x/y}</span>
            <span></span>
            <br> <br>
            <span>?op=%&x=[number]&y=[number]</span> <br>
            <span>return{"op":"%","x":number,"y":number,"value":x%y}</span>
            <span></span>
            <br> <br>
            <span>?op=!&n=[integer]</span> <br>
            <span>return{"op":"!","n":integer,"value":n!}</span>
            <span></span>
            <br> <br>
            <span>?op=p&n=[integer]</span> <br>
            <span>return{"op":"p","n":integer,"value":true if n is a prime number}</span>
            <span></span>
            <br> <br>
            <span>?op=np&n=[integer]</span> <br>
            <span>return{"op":"np","n":integer,"value":nth prime number}</span>
            <span></span>

        </h2>   
        </fieldset>     
`);
}
function showWaitingGif() {
    $("#content").empty();
    $("#content").append($("<div class='waitingGifcontainer'><img class='waitingGif' src='Loading_icon.gif' /></div>'"));
}
function eraseContent() {
    $("#content").empty();
}
function ValidateNumber(parameter, nb, errorMessage) {
    if (isNaN(nb))
        errorMessage += "'" + parameter + "' parameter is not a number" + " ";
    return errorMessage;
}
function factorial(n) {
    if (n === 0 || n === 1) {
        return 1;
    }
    return n * factorial(n - 1);
}
function isPrime(value) {
    for (var i = 2; i < value; i++) {
        if (value % i === 0) {
            return false;
        }
    }
    return value > 1;
}
function findPrime(n) {
    let primeNumber = 0;
    for (let i = 0; i < n; i++) {
        primeNumber++;
        while (!isPrime(primeNumber)) {
            primeNumber++;
        }
    }
    return primeNumber;
}