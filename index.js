var fs = require('fs');
var app_directory = "";
var config = {};
var data = {};
var translator = require('./translate');
var app = require('express')();


var init  = function(_config)
{
    config = _config;
    config.langDir        = (config.langDir == undefined)        ? "language" : config.langDir;
    config.cookieName     = (config.cookieName == undefined)     ? "language" : config.cookieName;
    config.equalizeKeys   = (config.equalizeKeys == undefined)   ? true       : config.equalizeKeys;
    config.translate      = (config.translate == undefined)      ? true       : config.translate;
    config.instanceName   = (config.instanceName == undefined)     ? "_lt"      : config.instanceName;

    if(config.langs == undefined || config.langs.length == 0)
    {
        throw "langs must not be undefined and empty!";
    }
    else if(config.defaultLang == undefined || !config.langs.includes(config.defaultLang))
    {
        throw "defaultLang is invalid!";
    }

    if(config.translate && config.translationApiKey == undefined)
    {
        throw "translationApiKey is invalid!";
    }

    app.set("lt_config_langDir", config.langDir);
    app.set("lt_config_cookieName", config.cookieName);
    app.set("lt_config_defaultLang", config.defaultLang);
    app.set("lt_config_langDir", config.langDir);
    app.set("lt_config_instanceName", config.instanceName);

    translator(config.translationApiKey);
    createDir([config.langDir]);
    config.langs.forEach(function(item)
    {
        createDir([config.langDir, item]);
        if(item == "tr")
        {
            var content =
                {
                    "comment": "Bu dosyayı ortak metinler için kullanın.",
                    "example": "Örnek yazı"
                }
        }
        else if(item == "en")
        {
            var content =
                {
                    "comment": "Use this file for common texts",
                    "example": "Example text"
                }
        }
        else
        {
            var  content = {};
        }

        createFile([config.langDir, item, item + ".json"], JSON.stringify(content, null, "\t"));
    });


    if(config.equalizeKeys)
    {
        equalizeLangFilesEachOther();
    }

    return function onRequest(req, res, next)
    {
        if(req.cookies != undefined && req.cookies[config.cookieName] != undefined)
        {
            config.cookieLang = req.cookies[config.cookieName];
            if(!config.langs.includes(config.cookieLang))
            {
                throw "cookieName is invalid!";
            }

        }
        else
        {
            config.cookieLang = config.defaultLang;
        }

        if(req.cookies != undefined && req.cookies[config.cookieName] == undefined)
        {
            res.cookie(config.cookieName, config.cookieLang);
        }
        res.locals.lt_config_cookieLang = config.cookieLang;
        var lfl = new LangFileLoader(req, res);
        res.locals[app.get('lt_config_instanceName')] = lfl;
        next();
    };
}

function equalizeLangFilesEachOther()
{
    var defaultPath = config.langDir + "/" + config.defaultLang + "/";

    config.langs.forEach(function(item)
    {
        if(item !== config.defaultLang)
        {
            var currentPath = config.langDir + "/" + item + "/";
            equalizeFolders(item, defaultPath, currentPath);
        }
    });
}

function equalizeFolders(item, defaultPath, currentPath)
{
    fs.readdirSync(defaultPath).forEach(file =>
    {
        var relativeDefaultPath = defaultPath + "/" + file;
        var relativeCurrentPath = currentPath + "/" + file;
        if(fs.statSync(relativeDefaultPath).isDirectory())
        {
            if (!fs.existsSync(relativeCurrentPath))
            {
                fs.mkdirSync(relativeCurrentPath);
            }
            equalizeFolders(item, relativeDefaultPath, relativeCurrentPath);
        }
        else
        {
            equalizeLangFile(item, relativeDefaultPath, relativeCurrentPath);
        }
    });
}

function equalizeLangFile(item, relativeDefaultPath, relativeCurrentPath)
{
    var promises = {};
    if(!relativeDefaultPath.endsWith(config.defaultLang + ".json"))
    {
        defaultLangJsonFileJson  = loadFile(relativeDefaultPath);
        createFilev2(relativeCurrentPath, JSON.stringify({}, null, "\t"));
        currentLangJsonFileJson  = loadFile(relativeCurrentPath);
        promises[relativeCurrentPath] = [];
        for(var key in defaultLangJsonFileJson)
        {
            if(currentLangJsonFileJson[key] == undefined)
            {
                promises[relativeCurrentPath].push(translator.translate(config.defaultLang, item, key, defaultLangJsonFileJson[key], relativeCurrentPath));
            }
        }
    }

    for(key in promises)
    {
        Promise.all(promises[key]).then(function(translatedTexts)
        {
            if(translatedTexts.length > 0)
            {
                var json  = loadFile(translatedTexts[0].filePath);
                var filePath = translatedTexts[0].filePath;
                translatedTexts.forEach(function(translatedText)
                {
                    json[translatedText.key] = translatedText.value;
                });

                save(filePath, JSON.stringify(json, null, "\t"));
            }
        });
    }
}

function createFile(path_parts, content)
{
    var filePath = app_directory;
    for(var i = 0; i < path_parts.length; i++)
    {

        if(i == 0)
        {
            filePath += path_parts[i];
        }
        else
        {
            filePath += "/" + path_parts[i];
        }
    }
    if (!fs.existsSync(filePath))
    {
        fs.writeFileSync(filePath, content, 'utf8', function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
}

function createFilev2(filePath, content)
{
    if (!fs.existsSync(filePath))
    {
        fs.writeFileSync(filePath, content, 'utf8', function (err) {
            if (err) {
                console.log(err);
            }
        });
    }
}
function loadFile(filePath)
{
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function createDir(path_parts)
{
    var dir = app_directory;
    for(var i = 0; i < path_parts.length; i++)
    {
        if(i == 0)
        {
            dir += path_parts[i];
        }
        else
        {
            dir += "/" + path_parts[i];
        }
    }
    if (!fs.existsSync(dir))
    {
        fs.mkdirSync(dir);
    }
}

function getLang()
{
    return (config.cookieLang == undefined || config.cookieLang == "") ? config.defaultLang : config.cookieLang;
}



function save(filePath, content)
{
    fs.writeFileSync(filePath, content, 'utf8', function (err) {
        if (err) {
            console.log(err);
        }
    });
}

var get = function(key)
{
    var value = "";
    for(var i = 0; i < arguments.length; i++)
    {

        if(i == 0)
        {
            key = arguments[i];
            value = (data[key] == undefined) ? "" : data[key];
        }
        else
        {
            value = value.replace("%s", arguments[i]);
        }
    }
    return value;
}


class LangFileLoader
{
    constructor(req, res)
    {
        this.req = req;
        this.res = res;
        var fullPath = app.get("lt_config_langDir") + "/" + res.locals.lt_config_cookieLang + "/" + this.res.locals.lt_config_cookieLang + ".json";
        this.data = JSON.parse(fs.readFileSync(fullPath, "utf8"));
    }

    load(filePath)
    {
        var fullPath = app.get("lt_config_langDir") + "/" + this.res.locals.lt_config_cookieLang + "/" + filePath + ".json";
        this.data = Object.assign(this.data, JSON.parse(fs.readFileSync(fullPath, "utf8")));
    }

    get(key)
    {
        var value = "";
        for(var i = 0; i < arguments.length; i++)
        {
            if(i == 0)
            {
                key = arguments[i];
                value = (this.data[key] == undefined) ? "" : this.data[key];
            }
            else
            {
                value = value.replace("%s", arguments[i]);
            }
        }
        return value;
    }

}

module.exports.init      = init;
