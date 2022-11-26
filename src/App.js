import {HashRouter} from 'react-router-dom'
import './App.css';
import IndexRouter from "./routers/IndexRouter";
import './utils/http'
import {Provider} from "react-redux";
import store from "./redux/store";

function App() {
    return (
        <Provider store={store}>
            <HashRouter>
                <IndexRouter/>
            </HashRouter>
        </Provider>
    )
}

export default App;
