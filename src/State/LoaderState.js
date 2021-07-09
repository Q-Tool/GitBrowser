import {store} from '@risingstack/react-easy-state';
import cuid from 'cuid'

const LoaderState = store({
    loaders: [],
    addLoader: async (title, method) => {
        const id = cuid();
        LoaderState.loaders.push({
            id: id,
            title: title
        });

        const loader = async() => {
            await method();
            LoaderState.removeLoader(id);
        }
        return loader();
    },
    removeLoader: (id) => {
        const newLoaders = [];
        LoaderState.loaders.forEach(loader => {
            if(loader.id !== id){
                newLoaders.push(loader);
            }
        })
        LoaderState.loaders = newLoaders;
    }
});

export default LoaderState;