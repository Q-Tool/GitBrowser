import React from 'react'
import {view} from '@risingstack/react-easy-state';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import GlobalState from "../State/GlobalState";
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Content = () => {
    if(GlobalState.currentFile){
        return (
            <SyntaxHighlighter className='code-view' style={darcula} language={GlobalState.currentFileType}>
                {GlobalState.currentFile}
            </SyntaxHighlighter>
        );
    } else {
        return "No File Open";
    }
}

export default view(Content)