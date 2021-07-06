import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete'
import GlobalState from "../State/GlobalState";
import {view} from '@risingstack/react-easy-state'

const mockGitBranches = [
    'branch1', 'branch2', 'branch3'
];

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
                        onChange={(event) => GlobalState.setRepo(event.target.value)}
                    />
                    <Autocomplete
                        options={mockGitBranches}
                        fullWidth
                        renderInput={(params => <TextField {...params} label='Branch' />)}
                    />
                </div>
            </>
        )
    }

}

export default view(Sidebar);