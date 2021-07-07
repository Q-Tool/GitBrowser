import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete'
import GlobalState from "../State/GlobalState";
import {view} from '@risingstack/react-easy-state'

class Sidebar extends Component{

    render(){
        console.log(GlobalState.repos)
        return (
            <>
                <div style={{color: '#FFF'}}>
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
            </>
        )
    }

}

export default view(Sidebar);