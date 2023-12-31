import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import WatchVideo from "./pages/WatchVideo/WatchVideo"
import Channel from "./pages/Channel/Channel"
import { ChannelProvider } from "./contexts/ChannelContext"
import { TagProvider } from "./contexts/TagContext";
import SearchVideo from "./pages/SearchVideo/SearchVideo";
import History from "./pages/History/History"
import Subscribes from "./pages/SubscribesVideo/SubscribesVideo"
import { ThemeProvider } from "@emotion/react";
import { createTheme } from '@mui/material/styles';
import Studio from "./pages/Studio/Studio";

const App = () => {
    const { user } = useContext(AuthContext);
    return (
        <ThemeProvider theme={createTheme({
            palette: {
              primary: { main: '#ff366f' },
              secondary: { main: '#ffb340' },
            },
          })}>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={ <TagProvider><Home/></TagProvider> } />
                    <Route path="/login" element={ user ? <Navigate to="/" /> : <Login/> } />
                    <Route path="/register" element={ user ? <Navigate to="/" /> : <Register/> } />
                    <Route path="/search" element={ <TagProvider><SearchVideo/></TagProvider> } />

                    <Route path="/history" element={ user ? <History/> : <Navigate to="/login" />} />
                    <Route path="/subscribes" element={ user ? <Subscribes/> : <Navigate to="/login" />} />

                    <Route path="/channel/:channel_id" element={ <ChannelProvider><Channel/></ChannelProvider> } />
                    <Route path="/studio/:tab?" element={ true ? <Studio/> : <Navigate to="/login" /> } />
                    <Route path="/watch/:video_id/:playlist_id?/:playlist_order?" element={ <TagProvider><WatchVideo/></TagProvider> } />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}
export default App;