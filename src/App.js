import {HashRouter} from 'react-router-dom'
import './App.css';
import NewsRouter from "./routers/NewsRouter";
import './utils/http'
import {Provider} from "react-redux";
import store from "./redux/store";

function App() {
    return (
        <Provider store={store}>
            <HashRouter>
                <NewsRouter/>
            </HashRouter>
        </Provider>
    )
}

export default App;
