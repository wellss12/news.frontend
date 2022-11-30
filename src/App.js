import {HashRouter} from 'react-router-dom'
import './App.css';
import NewsRouter from "./routers/NewsRouter";
import './utils/http'
import {Provider} from "react-redux";
import {store, persistor} from "./redux/store";
import {PersistGate} from 'redux-persist/integration/react'

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <HashRouter>
                    <NewsRouter/>
                </HashRouter>
            </PersistGate>
        </Provider>
    )
}

export default App;
