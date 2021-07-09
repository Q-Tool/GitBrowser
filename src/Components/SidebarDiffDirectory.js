import React, {Component} from "react";
import GlobalState from "../State/GlobalState";
import {view} from '@risingstack/react-easy-state'
import {Folder as FolderIcon, Description as FileIcon} from "@material-ui/icons";
import language_identify from "../lib/language_identify";
import Langicon from "./Langicon";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class SidebarDiffDirectory extends Component {

    state = {
        expanded: false,
    }

    componentDidMount() {
        this.setState({
            expanded: this.props.expanded ? true : false,
        });
    }

    toggleExpanded() {
        this.setState({
            expanded: !this.state.expanded
        })
    }

    render() {
        const obj = this.props.obj ? this.props.obj : GlobalState.diffTree;
        if(obj.isDirectory){
            const dirs = [];
            const files = [];

            if(this.state.expanded && obj.children){
                obj.children.forEach(child => {
                    if(child.isDirectory){
                        dirs.push(child);
                    } else {
                        files.push(child);
                    }
                });
            }

            return (
                <>
                    <div className='sidebar-item sidebar-directory' onClick={() => this.toggleExpanded()}>
                        <div className='sidebar-item-caret'>{this.state.expanded ? <ExpandMoreIcon /> : <ChevronRightIcon />}</div>
                        <div className='sidebar-item-icon'><FolderIcon /></div>
                        <div className='sidebar-item-name'>{obj.name}</div>
                    </div>
                    <>
                        {dirs.map((dir, index) => (
                            <div key={index} style={{marginLeft: 5}}>
                                <SidebarDiffDirectoryBootstrapped obj={dir} expanded={true} />
                            </div>
                        ))}
                        {files.map((file, index) => (
                            <div key={index} style={{marginLeft: 25}}>
                                <SidebarDiffDirectoryBootstrapped obj={file} />
                            </div>
                        ))}
                    </>
                </>
            );
        } else {
            let icon = <FileIcon />
            if(obj.name){
                const filetype = language_identify(obj.path);
                if(filetype.thumbnail){
                    icon = <Langicon icon={filetype.thumbnail} />;
                }
            }

            return (
                <div className='sidebar-item sidebar-file' onClick={() => GlobalState.getFileContents(obj.path)}>
                    <div className='sidebar-item-icon'>{icon}</div>
                    <div className='sidebar-item-name'>
                        <div className='sidebar-item-name-name'>{obj.name}</div>
                        <div className='sidebar-item-diff'>
                            <div className='sidebar-item-lines-added'>+{obj.insertions}</div>
                            <div className='sidebar-item-lines-removed'>-{obj.deletions}</div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

const SidebarDiffDirectoryBootstrapped = view(SidebarDiffDirectory);

export default SidebarDiffDirectoryBootstrapped;