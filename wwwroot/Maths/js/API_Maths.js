const API_URL = "https://prong-certain-fibula.glitch.me";
function API_GetMathResult(parameters,url = '') {
    return new Promise(resolve => {
        let URL = url ===''? API_URL+"/api/maths" + "?":url+"/api/maths" + "?";
        parameters.forEach(param => {
            URL += param + "&";
        });
        if (parameters.length === 0){
            document.location.href = URL;
        }
        $.ajax({
            url: URL,
            success: contact => { resolve(contact); },
            error: () => { resolve(null); }
        });
    });
}
