import VirtualizedTable from "./VirtualizedTable";
import Paper from '@material-ui/core/Paper';
import {view} from '@risingstack/react-easy-state'
import GlobalState from "../../State/GlobalState";
import Dialog from "@material-ui/core/Dialog";
import {DialogContent, DialogTitle} from "@material-ui/core";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(() => ({
    paper: { minWidth: "1400px" },
}));

export default view(() => {
    const classes = useStyles();

    return (
        <Dialog aria-labelledby="simple-dialog-title" classes={{paper: classes.paper}} open={GlobalState.showCommitHistory} onClose={() => GlobalState.showCommitHistory = false}>
            <DialogTitle>Commit History</DialogTitle>
            <DialogContent>
                <Paper style={{ height: 'calc(100vh - 200px)', width: '100%' }}>
                    <VirtualizedTable
                        rowCount={GlobalState.commitHistory.length}
                        rowGetter={({ index }) => GlobalState.commitHistory[index]}
                        columns={[
                            {
                                width: 250,
                                label: 'Author',
                                dataKey: 'author_name',
                            },
                            {
                                width: 800,
                                label: 'Message',
                                dataKey: 'message',
                                numeric: false,
                            },
                            {
                                width: 250,
                                label: 'Date',
                                dataKey: 'date',
                                numeric: false,
                            }
                        ]}
                    />
                </Paper>
            </DialogContent>
        </Dialog>
    );
});