import IPC from '../index'

const store = {
    get: async (key) => {
        return await IPC.call('getStore', {key})
    },
    set: async (key, value) => {
        return await IPC.call('setStore', {key, value})
    }
}

export default store;