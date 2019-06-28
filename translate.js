var translateServiceUrl = "https://translate.yandex.net/api/v1.5/tr.json/translate?key=";
var serviceBasePath;
var https = require('https');

function init(apiKey)
{
    serviceBasePath = translateServiceUrl + apiKey;
}

function translate(from, to, key, text, filePath)
{
    return new Promise(function(resolve, reject)
    {
        requestUrl = serviceBasePath + "&text=" + encodeURI(text) + "&lang=" + from + "-" + to;
        https.get(requestUrl, (resp) =>
        {
            let data = '';

            resp.on('data', (chunk) => {
                data += chunk;
            });

            resp.on('end', () => {
                try
                {
                    var translationResponse = JSON.parse(data);
                    var translatedText = "";
                    if(translationResponse.code == "200" && translationResponse.text != undefined && translationResponse.text.length > 0)
                    {
                        translatedText = translationResponse.text[0];
                    }
                    else
                    {
                        translatedText = text;
                    }
                }
                catch(e)
                {
                    translatedText = text;
                }
                resolve({key: key, value: translatedText, filePath: filePath});
            });

        }).on("error", (err) => {
            console.log(err);
            reject({key: key, value: "", filePath: filePath});
        });
    });
}

module.exports = init;
module.exports.translate = translate;
