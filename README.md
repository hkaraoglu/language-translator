# multilanguage-node
Language translation module for nodeJS


Text translation module. It benefits from Express possibilities.

## **Install**

    npm install multilanguage --save


## *Load*

    var  multiLanguage = require('multiLanguage');
    app.use(multiLanguage(
      {
        langDir     : "language",
        langs       : ["tr", "en"],
        defaultLang : "en",
        cookieName  : "lang",
        accessName  : "lang"
    }));




## Configuration Parameters

*langs : Required*

The module creates folders which takes an json array from configuration json. The array is required.


*defaultLang: Required*

The module choose a language to choose a language folder as a default when cookie language is not be set. The defaultLang is required.


*langDir : Optional*

The module creates a root folder which takes its name from configuration json. The folder name is optional. Default name is ***language***.

*cookieName : Optional*

The module creates a cookie to know user's language preference which requested before. Default cookie name is ***language***.

accessName : Optional

The module load language file data into a variable. Default accessName is **lang**.


formatFuncName : Optional

The module offer a function to output formatted string.  Default accessName is **sprintf**.


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
		      -> mapping.json



---


## mapping.json

Example:

 ---
**Your Application directory:**

     your_app_folder
         -> language
    	      -> tr
    	        -> tr.json // It creates for common texts
    		    -> home.json
    		    -> about.json
    	      -> en
    		    -> en.json // It creates for common texts
    		    -> home.json
    		    -> about.json
		      -> mapping.json


**mapping.json**

{
	"/" 		   : "home",
	"/about" :  "about"
 }

This file matches your routes and language files.
