var fs = require('fs');
var app_directory = "";
var config = {};
var data = {};
var translator = require('./translate');

var get = function(key)
{
    var value = "";
    arguments = Array.from(arguments);
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
};

function init(_config)
{
  config = _config;
  config.langDir        = (config.langDir == undefined)        ? "language" : config.langDir;
  config.cookieName     = (config.cookieName == undefined)     ? "language" : config.cookieName;
  config.accessName     = (config.accessName == undefined)     ? "lang"     : config.accessName;
  config.formatFuncName = (config.formatFuncName == undefined) ? "sprintf"  : config.formatFuncName;
  config.equalizeKeys   = (config.equalizeKeys == undefined)   ? true       : config.equalizeKeys;
  config.translate      = (config.translate == undefined)      ? true       : config.translate;

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

  content = {

  };
  createFile([config.langDir, "mapping.json"], JSON.stringify(content, null, "\t"));

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




   var commonFilePath  =  app_directory + config.langDir + "/" + getLang() + "/" + getLang() + ".json";
   var mappingFilePath =  app_directory + config.langDir + "/mapping.json";

   var mapping = load(mappingFilePath);
   data = load(commonFilePath);

   var mappingValue = getMappingValue(req.path, mapping);
   if(mappingValue != "")
   {
      var currentFilePath = app_directory + config.langDir + "/" + getLang() + "/" + mappingValue + ".json";
      data = Object.assign(data, load(currentFilePath));
   }
   if(res.locals == undefined)
   {
      res.locals = {};
   }

   if(res.locals[config.accessName] == undefined)
   {
       res.locals[config.accessName] = data;
   }

   if(res[config.formatFuncName] == undefined)
   {
     res[config.formatFuncName] = get;
   }

   res.locals[config.formatFuncName] = get;
   next();
  };
}

function equalizeLangFilesEachOther()
{
  var defaultLanguageFolderPath = config.langDir + "/" + config.defaultLang + "/";
  var promises = {};

  config.langs.forEach(function(item)
  {
    if(item !== config.defaultLang)
    {
      fs.readdirSync(defaultLanguageFolderPath).forEach(file =>
      {
          if(file != config.defaultLang + ".json")
          {
            var defaultLangJsonFilePath = config.langDir + "/" + config.defaultLang + "/" + file;
            var currentLangJsonFilePath = config.langDir + "/" + item + "/" + file;
            defaultLangJsonFileJson  = load(defaultLangJsonFilePath);
            createFile([config.langDir, item, file], JSON.stringify({}, null, "\t"));
            currentLangJsonFileJson  = load(currentLangJsonFilePath);

            promises[currentLangJsonFilePath] = [];
            for(var key in defaultLangJsonFileJson)
            {
               if(currentLangJsonFileJson[key] == undefined)
               {
                 promises[currentLangJsonFilePath].push(translator.translate(config.defaultLang, item, key, defaultLangJsonFileJson[key], currentLangJsonFilePath));
               }
            }
          }
      });
    }
  });

  for(key in promises)
  {
      Promise.all(promises[key]).then(function(translatedTexts)
      {
        if(translatedTexts.length > 0)
        {
            var json  = load(translatedTexts[0].filePath);
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

function getMappingValue(path, mapping)
{
    if(path.length >= 2 && path.substr(path.length - 1) == "/")
    {
      path = path.substr(0, path.length - 1);
    }
    var pathSegments = path.split("/");
    for(var key in mapping)
    {
      var mappingSegments = key.split('/');
      if(mappingSegments.length == pathSegments.length)
      {
        var isEqual = true;
        for(var j = 0 ; j < mappingSegments.length; j++)
        {
            if(mappingSegments[j].substr(0, 1) != ":" && mappingSegments[j] != pathSegments[j])
            {
               isEqual = false;
               break;
            }
        }
        if(isEqual)
        {
          return mapping[key];
        }
      }
    }

    return "";
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

function load(filePath)
{
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function save(filePath, content)
{
  fs.writeFileSync(filePath, content, 'utf8', function (err) {
      if (err) {
         console.log(err);
      }
  });
}

module.exports      = init;
