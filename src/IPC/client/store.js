import IPC from '../index'

const store = {
    get: async (key) => {
        return await IPC.getStore({key})
    },
    set: async (key, value) => {
        return await IPC.setStore({key, value})
    }
}

export default store;