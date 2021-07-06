import React, {Component} from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete'

const mockGitRepos = [
    'repo1', 'repo2', 'repo3'
];

const mockGitBranches = [
    'branch1', 'branch2', 'branch3'
];

class Sidebar extends Component{

    render(){
        return (
            <>
                <div style={{color: '#FFF'}}>
                    <Autocomplete
                        options={mockGitRepos}
                        fullWidth
                        renderInput={(params => <TextField {...params} label='Git Repo' />)}
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

export default Sidebar;