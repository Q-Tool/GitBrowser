import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete'
import GlobalState from "../State/GlobalState";
import {view} from '@risingstack/react-easy-state'
import SidebarDirectory from "./SidebarDirectory";

const Sidebar = () => {
    return (
        <>
            <div className='sidebar' style={{color: '#FFF'}}>
                <div className='sidebar-header'>
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
                </div>
                <div className='sidebar-content'>
                    <SidebarDirectory expanded={true} />
                </div>
            </div>
        </>
    )
}

export default view(Sidebar);