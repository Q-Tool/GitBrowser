import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete'
import GlobalState from "../State/GlobalState";
import {view} from '@risingstack/react-easy-state'
import SidebarDirectory from "./SidebarDirectory";
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SyncIcon from '@material-ui/icons/Sync';
import AddIcon from '@material-ui/icons/Add';

import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import HistoryIcon from '@material-ui/icons/History';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import FastForwardIcon from '@material-ui/icons/FastForward';
import SidebarDiffDirectory from "./SidebarDiffDirectory";

const Sidebar = () => {
    const [showOptions, setShowOptions] = useState(true);
    const [showDiff, setShowDiff] = useState(false);

    const TreeSelection = () => {
        return (
            <ButtonGroup size="small">
                <Button variant={showDiff ? "outlined" : "contained"} onClick={() => setShowDiff(false)}><AccountTreeIcon /></Button>
                <Button variant={showDiff ? "contained" : "outlined"} onClick={() => setShowDiff(true)}><ChangeHistoryIcon /></Button>

                {!showOptions && <Button onClick={() => GlobalState.traverseHistory(-1)} disabled={!GlobalState.canTraverseBackward}><ChevronLeftIcon /></Button>}
                {!showOptions && <Button onClick={() => GlobalState.traverseHistory(1)} disabled={!GlobalState.canTraverseForward}><ChevronRightIcon /></Button>}
                {!showOptions && <Button onClick={() => GlobalState.traverseHistory(0)} disabled={!GlobalState.canTraverseForward}><FastForwardIcon /></Button>}
            </ButtonGroup>
        );
    }

    return (
        <>
            <div className='sidebar' style={{color: '#FFF'}}>
                <div className='sidebar-header'>
                    <div style={{padding: 10, display: "flex", alignItems: "center"}}>
                        <div style={{flexGrow: 1}}>
                            <ButtonGroup size="small">
                                <Button onClick={() => setShowOptions(!showOptions)}>{showOptions ? <ExpandLessIcon /> : <ExpandMoreIcon />}</Button>
                            </ButtonGroup>
                        </div>
                        <div style={{flexGrow: 1, textAlign: "right"}}>
                            {showOptions && (
                                <ButtonGroup size="small">
                                    <Button onClick={() => { GlobalState.showCommitHistory = true }}><HistoryIcon /></Button>
                                    <Button onClick={() => { GlobalState.gitPull() }}><SyncIcon /></Button>
                                    <Button><AddIcon /></Button>
                                </ButtonGroup>
                            )}
                            {!showOptions && (
                                <TreeSelection />
                            )}
                        </div>
                    </div>
                    {showOptions && (
                        <>
                            <Autocomplete
                                options={GlobalState.repos}
                                fullWidth
                                renderInput={(params => <TextField {...params} label='Git Repo' />)}
                                value={GlobalState.currentRepo}
                                onChange={(event, newValue) => GlobalState.setRepo(newValue)}
                            />
                            <Autocomplete
                                options={GlobalState.branches}
                                fullWidth
                                getOptionLabel={(option) => option.replace('remotes/origin/', '')}
                                value={GlobalState.currentBranch}
                                renderInput={(params => <TextField {...params} label='Branch' />)}
                                onChange={(event, newValue) => GlobalState.setBranch(newValue)}
                            />
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <div style={{padding: 10, textAlign: "left", flexGrow: 1}}>
                                    <TreeSelection />
                                </div>
                                <div style={{padding: 10, textAlign: "right", flexGrow: 1}}>
                                    {showOptions && <ButtonGroup size="small">
                                        <Button onClick={() => GlobalState.traverseHistory(-1)} disabled={!GlobalState.canTraverseBackward}><ChevronLeftIcon /></Button>
                                        <Button onClick={() => GlobalState.traverseHistory(1)} disabled={!GlobalState.canTraverseForward}><ChevronRightIcon /></Button>
                                        <Button onClick={() => GlobalState.traverseHistory(0)} disabled={!GlobalState.canTraverseForward}><FastForwardIcon /></Button>
                                    </ButtonGroup>}
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className='sidebar-content'>
                    {showDiff ? (
                        <SidebarDiffDirectory expanded={true} />
                    ) : (
                        <SidebarDirectory expanded={true} />
                    )}

                </div>
            </div>
        </>
    )
}

export default view(Sidebar);