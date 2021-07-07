import _ from 'lodash';
import language_meta from "./language_meta";

export default (filename) => {
    const languageKeys = Object.keys(language_meta);
    let match = null;
    let match_ext_len = 0;

    languageKeys.forEach((languageKey) => {
        language_meta[languageKey].extensions.forEach(extension => {
            // New "better" match found
            if(extension.length > match_ext_len && _.endsWith(filename.toLowerCase(), extension.toLowerCase())){
                match = language_meta[languageKey];
                match_ext_len = extension.length;
            }
        });
    });


    // No match found!
    if(!match){
        match = {
            name: "Text",
            syntaxName: "text",
            thumbnail: "",
            extensions: ['.txt']
        };
    }

    console.log(match);
    return match;
}