



# language-translator
Text localization and translation module for NodeJS Express Framework.

## **Install**

    npm install language-translator --save


## **Load**

    var  languageTranslator = require('language-translator');
    app.use(languageTranslator.init(
      {
        langs          : ["tr", "en", "fr", "de", "es"], // ... And other languages
        defaultLang    : "en",
	    cookieName     : "lang",
	    translate      : "true",
        translationApiKey: "{{your_yandex_translate_api_key}}"
    }));




## Configuration Parameters

 **langs**

The module creates folders which takes an json array from configuration json. The array is required.


 **defaultLang**

The module choose a language to choose a language folder as a default when cookie language is not be set. The defaultLang is required.


**langDir**

The module creates a root folder which takes its name from configuration json. The langDir is optional. Default value is
*language*.

**cookieName**

The module creates a cookie to know user's language preference which requested before. Default cookie name is *language*.

**equalizeKeys**

The module offer an option to equalize keys of default language's json files with other languages. For example, you created a json file in default language folder but not in other language folders. When you restart node server, module creates all files and keys in other language folders for you. Default value is true. (Recommended)

**translate**

The module offer translate default language files to another language by using Yandex Translator API. Default value is true. (Recommended)

**translationApiKey** :

If you want translate all texts in default language folder's json files, you have to create API key in Yandex Developers Page. (https://translate.yandex.com/developers/keys) . It's free. This parameter is required if parameter *translate* is **true**.

Notice: If you use translation, you have to define items in ***langs*** array like below:

**Supported Language List:**

<table> <tbody>      <tr><th width="175">Language</th><th width="175">Code</th><th width="175">Language</th><th width="175">Code</th></tr>   <tr><td width="175">Azerbaijan</td><td width="175">az</td><td width="175">Malayalam</td><td width="175">ml</td></tr> <tr><td width="175">Albanian</td><td width="175">sq</td><td width="175">Maltese</td><td width="175">mt</td></tr> <tr><td width="175">Amharic</td><td width="175">am</td><td width="175">Macedonian</td><td width="175">mk</td></tr> <tr><td width="175">English</td><td width="175">en</td><td width="175">Maori</td><td width="175">mi</td></tr> <tr><td width="175">Arabic</td><td width="175">ar</td><td width="175">Marathi</td><td width="175">mr</td></tr> <tr><td width="175">Armenian</td><td width="175">hy</td><td width="175">Mari</td><td width="175">mhr</td></tr> <tr><td width="175">Afrikaans</td><td width="175">af</td><td width="175">Mongolian</td><td width="175">mn</td></tr> <tr><td width="175">Basque</td><td width="175">eu</td><td width="175">German</td><td width="175">de</td></tr> <tr><td width="175">Bashkir</td><td width="175">ba</td><td width="175">Nepali</td><td width="175">ne</td></tr> <tr><td width="175">Belarusian</td><td width="175">be</td><td width="175">Norwegian</td><td width="175">no</td></tr> <tr><td width="175">Bengali</td><td width="175">bn</td><td width="175">Punjabi</td><td width="175">pa</td></tr> <tr><td width="175">Burmese</td><td width="175">my</td><td width="175">Papiamento</td><td width="175">pap</td></tr> <tr><td width="175">Bulgarian</td><td width="175">bg</td><td width="175">Persian</td><td width="175">fa</td></tr> <tr><td width="175">Bosnian</td><td width="175">bs</td><td width="175">Polish</td><td width="175">pl</td></tr> <tr><td width="175">Welsh</td><td width="175">cy</td><td width="175">Portuguese</td><td width="175">pt</td></tr> <tr><td width="175">Hungarian</td><td width="175">hu</td><td width="175">Romanian</td><td width="175">ro</td></tr> <tr><td width="175">Vietnamese</td><td width="175">vi</td><td width="175">Russian</td><td width="175">ru</td></tr> <tr><td width="175">Haitian (Creole)</td><td width="175">ht</td><td width="175">Cebuano</td><td width="175">ceb</td></tr> <tr><td width="175">Galician</td><td width="175">gl</td><td width="175">Serbian</td><td width="175">sr</td></tr> <tr><td width="175">Dutch</td><td width="175">nl</td><td width="175">Sinhala</td><td width="175">si</td></tr> <tr><td width="175">Hill Mari</td><td width="175">mrj</td><td width="175">Slovakian</td><td width="175">sk</td></tr> <tr><td width="175">Greek</td><td width="175">el</td><td width="175">Slovenian</td><td width="175">sl</td></tr> <tr><td width="175">Georgian</td><td width="175">ka</td><td width="175">Swahili</td><td width="175">sw</td></tr> <tr><td width="175">Gujarati</td><td width="175">gu</td><td width="175">Sundanese</td><td width="175">su</td></tr> <tr><td width="175">Danish</td><td width="175">da</td><td width="175">Tajik</td><td width="175">tg</td></tr> <tr><td width="175">Hebrew</td><td width="175">he</td><td width="175">Thai</td><td width="175">th</td></tr> <tr><td width="175">Yiddish</td><td width="175">yi</td><td width="175">Tagalog</td><td width="175">tl</td></tr> <tr><td width="175">Indonesian</td><td width="175">id</td><td width="175">Tamil</td><td width="175">ta</td></tr> <tr><td width="175">Irish</td><td width="175">ga</td><td width="175">Tatar</td><td width="175">tt</td></tr> <tr><td width="175">Italian</td><td width="175">it</td><td width="175">Telugu</td><td width="175">te</td></tr> <tr><td width="175">Icelandic</td><td width="175">is</td><td width="175">Turkish</td><td width="175">tr</td></tr> <tr><td width="175">Spanish</td><td width="175">es</td><td width="175">Udmurt</td><td width="175">udm</td></tr> <tr><td width="175">Kazakh</td><td width="175">kk</td><td width="175">Uzbek</td><td width="175">uz</td></tr> <tr><td width="175">Kannada</td><td width="175">kn</td><td width="175">Ukrainian</td><td width="175">uk</td></tr> <tr><td width="175">Catalan</td><td width="175">ca</td><td width="175">Urdu</td><td width="175">ur</td></tr> <tr><td width="175">Kyrgyz</td><td width="175">ky</td><td width="175">Finnish</td><td width="175">fi</td></tr> <tr><td width="175">Chinese</td><td width="175">zh</td><td width="175">French</td><td width="175">fr</td></tr> <tr><td width="175">Korean</td><td width="175">ko</td><td width="175">Hindi</td><td width="175">hi</td></tr> <tr><td width="175">Xhosa</td><td width="175">xh</td><td width="175">Croatian</td><td width="175">hr</td></tr> <tr><td width="175">Khmer</td><td width="175">km</td><td width="175">Czech</td><td width="175">cs</td></tr> <tr><td width="175">Laotian</td><td width="175">lo</td><td width="175">Swedish</td><td width="175">sv</td></tr> <tr><td width="175">Latin</td><td width="175">la</td><td width="175">Scottish</td><td width="175">gd</td></tr> <tr><td width="175">Latvian</td><td width="175">lv</td><td width="175">Estonian</td><td width="175">et</td></tr> <tr><td width="175">Lithuanian</td><td width="175">lt</td><td width="175">Esperanto</td><td width="175">eo</td></tr> <tr><td width="175">Luxembourgish</td><td width="175">lb</td><td width="175">Javanese</td><td width="175">jv</td></tr> <tr><td width="175">Malagasy</td><td width="175">mg</td><td width="175">Japanese</td><td width="175">ja</td></tr> <tr><td width="175">Malay</td><td width="175">ms</td><td width="175"></td><td width="175"></td></tr>  </tbody> </table>





## Usage

When your app started, firstly the module creates **language** folder in root directory. Then, it creates folders which names are in **langs** array.  Then, it creates a json file which name is same as its folder name for common texts. And it creates a mapping.json file which is used to match route paths and language files.

**For example:**

    langs : ["tr", "en"]


 ---

     your_app_folder
         -> language
    	      -> tr
    	        -> tr.json // It creates for common texts
    		-> And your other language files...
    	      -> en
    		-> en.json // It creates for common texts
    		-> And your other language files...


--
**en.json file content:**

    {
    	"example"           : "Example Text",
    	"example_with_param": "Example %s"
    }

**On view file usage (Example for .ejs):**

    <%=  _lt.get('example')  %>

**Formatted:**

    <%=  _lt.get(example_with_param, "Param value")  %>

--

**On js file usage**

     var _lt = res.locals._lt;
     _lt.load("home");
     console.log(_lt.get("example_with_param", "Param value"));
---


Example:

**Your Application directory:**

     your_app_folder
         -> language
    	      -> tr
    	        -> tr.json // It is used for common texts
    		-> home.json
    		-> about.json
			-> users.json
    	      -> en
			-> en.json // It is used for common texts
			-> home.json
			-> about.json
			-> users.json   



Please **STAR** and **WATCH** the project! :)


**References**:
“Medium.com - Nodejs text localization module” https://medium.com/@hkaraoglutr/nodejs-text-localization-module-687d3d285c3a
