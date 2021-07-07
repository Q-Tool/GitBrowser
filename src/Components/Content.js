import React from 'react'
import {view} from '@risingstack/react-easy-state';
import {Highlight as SyntaxHighlighter} from "react-fast-highlight";
import GlobalState from "../State/GlobalState";
import 'highlight.js/styles/atom-one-dark.css'
import hljs from "highlight.js";

const Content = () => {
    if(GlobalState.currentFile){
        return (
            <SyntaxHighlighter className='code-view' languages={hljs.listLanguages()}>
                {GlobalState.currentFile}
            </SyntaxHighlighter>
        );
    } else {
        return "No File Open";
    }
}

export default view(Content)