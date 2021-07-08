import './App.css'
import 'devicon/devicon.min.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import {view} from '@risingstack/react-easy-state'


import Sidebar from "./Components/Sidebar";
import Loader from "./Components/Loader"
import {Component} from "react";
import IPC from "./IPC";
import GlobalState from "./State/GlobalState";
import Content from "./Components/Content";
import CommitHistory from './Components/CommitHistory'

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: purple[300],
        },
        secondary: {
            main: '#f44336',
        },
    },
});

class App extends Component{

    async componentDidMount(){
        IPC.init();

        IPC.setMenu([
            { role: 'fileMenu' },
            { role: 'editMenu' },
            { role: 'viewMenu' }
        ]);

        GlobalState.init();
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <div className="App">
                    <div className='mainView'>
                        <div>
                            <Sidebar />
                        </div>
                        <div className='contentContainer'>
                            <Content />
                        </div>
                    </div>
                </div>
                <CommitHistory />
                <Loader />
            </ThemeProvider>
        );
    }
}

export default view(App);
