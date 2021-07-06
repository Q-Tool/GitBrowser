import './App.css'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import store from "./IPC/client/store";
import {view} from '@risingstack/react-easy-state'


import Sidebar from "./Components/Sidebar";
import {Component} from "react";

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
        await store.set('test', '123');
        console.log(await store.get('test'))
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <div className="App">
                    <div className='mainView'>
                        <div>
                            <Sidebar />
                        </div>
                        <div>
                            test 2
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}

export default view(App);
