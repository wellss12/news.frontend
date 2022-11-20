import React, {useEffect, useState} from 'react';
import {Editor} from "react-draft-wysiwyg";
import {EditorState, convertToRaw, ContentState} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export default function NewsEditor(props) {
    const [editorState, setEditorState] = useState();
    useEffect(() => {
        //撰寫新聞會把 undefined傳進來,所以在這要判斷
        if (props.newsContent === undefined) {
            return
        }
        const contentBlock = htmlToDraft(props.newsContent);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    }, [props.newsContent])

    // Ref:https://jpuri.github.io/react-draft-wysiwyg/#/docs?_k=jjqinp
    return (
        <div>
            <Editor
                //editorState => 讓組件變成受控的 都會跟onEditorStateChange搭配
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(editorState) => setEditorState(editorState)}
                onBlur={() => {
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())));
                }}
            />;
        </div>
    );
}
