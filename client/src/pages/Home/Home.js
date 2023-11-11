import "./styles.css";
import { config } from "../../shared"
import Header from "../../components/Header/Header"
import GanreBar from "../../components/GanreBar/GanreBar"
import VideoListElement from "../../components/VideoListElement/VideoListElement";
import { HeaderProvider } from "../../contexts/HeaderContext";
import { TagContext } from "../../contexts/TagContext";

import { useState, useEffect, useContext } from "react";
import axios from "axios";


export default function Home() {
  const { selectedTagType, selectedTagValue } = useContext(TagContext);
  const [videoList, setVideoList] = useState([]);

  const onEndPage = async () => {
    try {
      const res = await axios.get(`${config.backendUrl}/videos/byTag`, { params: {
        index: videoList.length,
        offset: 20,
        selectedTagType,
        selectedTagValue,
      }});
      setVideoList([...videoList, ...res.data]);
    }
    catch (err) {
        console.log(err.response.data.message);
    }
  };

  const getVideosByTag = async () => {
    try {
      const res = await axios.get(`${config.backendUrl}/videos/byTag`, { params: {
        index: videoList.length,
        offset: 20,
        selectedTagType,
        selectedTagValue,
      }});
      setVideoList(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(()=>{ getVideosByTag(); }, [selectedTagType, selectedTagValue]);
  useEffect(() => { getVideosByTag(); }, []);

  return (
    <div className="main-container">
      <HeaderProvider><Header/></HeaderProvider>
      <GanreBar/>
      <div className="video-grid" onScroll={(e)=>{
        (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight-2) && onEndPage()
      }}>
        {videoList.map(video =>{ return <VideoListElement key={video._id} video={video} showOwner={true}/> })}
      </div>
    </div>
  );
}