import React, {Component} from "react";
import GlobalState from "../State/GlobalState";
import {view} from '@risingstack/react-easy-state'
import {Folder as FolderIcon, Description as FileIcon} from "@material-ui/icons";

class SidebarDirectory extends Component {

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
        const obj = this.props.obj ? this.props.obj : GlobalState.directoryTree;
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
                        <div className='sidebar-item-icon'><FolderIcon /></div>
                        <div className='sidebar-item-name'>{obj.name}</div>
                    </div>
                    <>
                        {dirs.map((dir, index) => (
                            <div key={index} style={{marginLeft: 10}}>
                                <SidebarDirectoryBootstrapped obj={dir} />
                            </div>
                        ))}
                        {files.map((file, index) => (
                            <div key={index} style={{marginLeft: 10}}>
                                <SidebarDirectoryBootstrapped obj={file} />
                            </div>
                        ))}
                    </>
                </>
            );
        } else {
            return (
                <div className='sidebar-item sidebar-file'>
                    <div className='sidebar-item-icon'><FileIcon /></div>
                    <div className='sidebar-item-name'>{obj.name}</div>
                </div>
            );
        }
    }
}

const SidebarDirectoryBootstrapped = view(SidebarDirectory);

export default SidebarDirectoryBootstrapped;