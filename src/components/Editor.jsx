import React from 'react';
import { Draft, Data, Blocks } from 'draft-wysiwyg';

class TextEditor extends React.Component {

    constructor(props) {
        super(props);

        var consoleError = console.error;
        console.error = (err) => {
            if(err !== 'Warning: A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional.'){
                consoleError(err);
            }
        };
        // load saved data from localStorage
        var data = this.load();

        this.handleUpdate = this.handleUpdate.bind(this);

        if (data) {
            try {
                data = JSON.parse(data);
            }
            catch (err) {
                data = null;
                console.error(err);
            }
        } else {
            data = null;
        }
        this.state = {
            data: data,
            view: 'edit',
            saved: false,
        }
    }

    componentDidMount() {
        setInterval(() => {
            if (!this.state.saved) {
                this.save();
            }
        },30000);
    }

    save() {
        this.setState({ saved: true });
        localStorage.setItem("data",JSON.stringify(this.state.data));
    }

    load() {
        localStorage.getItem("data");
    }

    handleUpdate(raw,EditorState) {
        this.setState({ data: raw, saved: false });
    }

    render() {
        let editorStyle = {
            width: '100%',
            height: '100%'
        };
        const {data, view, saved} = this.state;
        return (<div>
                <Draft updateValue={ this.handleUpdate } placeholder="Write something!" style={ editorStyle } value={ data } />
                <button onClick={this.toRaw}></button>
                </div>);
    }
}

export default TextEditor;
