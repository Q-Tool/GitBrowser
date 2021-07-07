import {view} from '@risingstack/react-easy-state';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Dialog from '@material-ui/core/Dialog';
import LoaderState from '../State/LoaderState'
import CircularProgress from '@material-ui/core/CircularProgress';

export default view(() => {
    return (
        <Dialog aria-labelledby="simple-dialog-title" open={LoaderState.loaders.length !== 0}>
            {LoaderState.loaders.length === 1 && <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <DialogTitle id="simple-dialog-title">{LoaderState.loaders[0].title}</DialogTitle>
                <DialogContent>
                    <div style={{padding: 10}}>
                        <CircularProgress />
                    </div>
                </DialogContent>
            </div>}
            {LoaderState.loaders.length !== 1 && <>
                <DialogTitle id="simple-dialog-title">Loading...</DialogTitle>
                <DialogContent>
                    {LoaderState.loaders.map(loader => (
                        <div key={loader.id} style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                            <div>{loader.title}</div>
                            <div style={{padding: 10}}><CircularProgress size={13} /></div>
                        </div>
                    ))}
                </DialogContent>

            </>}
        </Dialog>
    );
});