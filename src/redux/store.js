import {legacy_createStore, combineReducers} from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import {CollapsedReducer} from "./reducers/CollapsedReducer";
import {LoadingReducer} from "./reducers/LoadingReducer";

const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer
})

const persistConfig = {
    key: 'wells',
    storage,
    whitelist: ['CollapsedReducer']
}

const persistedReducer = persistReducer(persistConfig, reducer);
let store = legacy_createStore(persistedReducer);
let persistor = persistStore(store);

export {
    store,
    persistor
}
