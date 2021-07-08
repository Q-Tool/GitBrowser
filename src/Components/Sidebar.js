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


const TreeSelection = () => {
    return (
        <ButtonGroup size="small">
            <Button variant="contained">Current Tree</Button>
            <Button>Diff Tree</Button>
        </ButtonGroup>
    );
}

const Sidebar = () => {
    const [showOptions, setShowOptions] = useState(true);

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
                                    <Button>+</Button>
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
                            <div style={{padding: 10, textAlign: "center"}}>
                                <TreeSelection />
                            </div>
                        </>
                    )}
                </div>
                <div className='sidebar-content'>
                    <SidebarDirectory expanded={true} />
                </div>
            </div>
        </>
    )
}

export default view(Sidebar);