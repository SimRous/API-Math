import Controller from './Controller.js';
import * as mathUtilities from '../mathUtilities.js';
import * as staticRessourcesServer from '../staticResourcesServer.js';
export default class MathsController extends Controller {
    constructor(HttpContext) {
        super(HttpContext);
    }

    get() {
        if (Object.keys(this.HttpContext.path.params).length === 0){
            this.HttpContext.req.url = "../wwwroot/Maths/help.html";
            staticRessourcesServer.handleStaticResourceRequest(this.HttpContext)

        }
        else{

        
        let errorMessage = '';
        let twoParameterOperators = [' ', '+', '-', '/','*','%'];
        let oneParameterOperators = ['!','p','np'];
        let res = 0;
        let responseJSON;
        let x;
        let y;
        let n;
        if (this.HttpContext.path.params.op !== undefined){
            if (twoParameterOperators.includes(this.HttpContext.path.params.op)){
                if (Object.keys(this.HttpContext.path.params).length > 3){
                    errorMessage += "Too many parameters";
                }
                else{
                    if (this.HttpContext.path.params.x === undefined){
                        errorMessage += "'x' parameter is missing";
                    }
                    else if (this.HttpContext.path.params.y === undefined){
                        errorMessage += "'y' parameter is missing";
                    }
                    else{
                        x = parseInt(this.HttpContext.path.params.x);
                        errorMessage = ValidateNumber("x", x, errorMessage);
                        y = parseInt(this.HttpContext.path.params.y);
                        errorMessage = ValidateNumber("y", y, errorMessage);

                    }
                }
            }
            else if (oneParameterOperators.includes(this.HttpContext.path.params.op)) {
                if (Object.keys(this.HttpContext.path.params).length > 2){
                    errorMessage += "Too many parameters";
                }
                else{
                    if (this.HttpContext.path.params.n === undefined){
                        errorMessage += "'n' parameter is missing";
                    }
                    else{
                        n = parseInt(this.HttpContext.path.params.n);
                        if(n <= 0){
                            errorMessage += "n parameter must be an integer > 0";
                        }
                        errorMessage = ValidateNumber("n", n, errorMessage);
                    }

                }
            }
        }
        else{
            errorMessage += "operator is missing";
        }
            if (errorMessage === '' && res === 0) {
                switch (this.HttpContext.path.params.op) {
                    case ' ':
                        this.HttpContext.path.params.op = '+';
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
                        if(this.HttpContext.path.params.x != 0 && this.HttpContext.path.params.y == 0)
                            res = "Infinity";
                        else if (this.HttpContext.path.params.x == 0 && this.HttpContext.path.params.y == 0)
                            res="NaN";
                        break;
                    case '%':
                        res = x % y;
                        if (this.HttpContext.path.params.y == 0)
                            res="NaN";
                        break;
                    case '!':
                        res = mathUtilities.factorial(n);
                        break;
                    case 'p':
                        res = mathUtilities.isPrime(n);
                        break;
                    case 'np':
                        res = mathUtilities.findPrime(n);
                        break;
                    default:
                        errorMessage += "'" + this.HttpContext.path.params.op + "' operator is not implemented" + " ";
                        break;
                }
            }
        if (errorMessage === '')
            responseJSON = { ...this.HttpContext.path.params, value: res }
        else
            responseJSON = { ...this.HttpContext.path.params, error: errorMessage }


        this.HttpContext.response.JSON(responseJSON);
    }
}
}
function ValidateNumber(parameter, nb, errorMessage) {
    if (isNaN(nb))
        errorMessage += "'" + parameter + "' parameter is not a number" + " ";
    return errorMessage;
}
