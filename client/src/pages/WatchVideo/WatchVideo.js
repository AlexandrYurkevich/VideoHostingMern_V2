import GanreBar from "../../components/GanreBar/GanreBar";
import Header from "../../components/Header/Header";
import {AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from "react-icons/ai"
import { Link } from "react-router-dom";
import "./styles.css";
import config from "../../config"
import NextVideoElement from "../../components/NextVideoElement/NextVideoElement";
import { HeaderProvider } from "../../contexts/HeaderContext";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { TagContext } from "../../contexts/TagContext";

export default function WatchVideo() {
  const { id } = useParams();
  const { selectedTagType, selectedTagValue } = useContext(TagContext);
  const { user, setUser } =  useContext(AuthContext);
  const [video, setVideo] = useState(null);
  const [channel, setChannel] = useState(null);
  const navigate = useNavigate();
  const [videoList, setVideoList] = useState([]);

  const onLike = async ()=>{
    try{
      !user && navigate("/login");
      if(user.liked?.includes(video?._id)){
        const res = await axios.put(`${config.backendUrl}/users/removelike`, { userId: user._id, videoId: video._id });
        setVideo(res.data.updatedVideo); setUser(res.data.updatedUser);
      }
      else{
        const res = await axios.put(`${config.backendUrl}/users/addlike`, { userId: user._id, videoId: video._id });
        setVideo(()=> { return res.data.updatedVideo });
        setUser(()=> { return res.data.updatedUser });
        if(user.disliked?.includes(video?._id)){
          const res = await axios.put(`${config.backendUrl}/users/removedislike`, { userId: user._id, videoId: video._id });
          setVideo(res.data.updatedVideo); setUser(res.data.updatedUser)
        }
      }
    }
    catch (err) {
      console.log(err.response.data.message);
    }
  }
  const onSubscribe = async ()=>{
    try{
      !user && navigate("/login");
      if(user.subscribedChannels?.includes(video?.channel)){
        const res = await axios.put(`${config.backendUrl}/users/unsubscribe`, {
          userId: user._id,
          channelId: video.channel
        });
        setChannel(res.data.updatedChannel);
        setUser(res.data.updatedUser)
      }
      else{
        const res = await axios.put(`${config.backendUrl}/users/subscribe`, {
          userId: user._id,
          channelId: video.channel
        });
        setChannel(res.data.updatedChannel);
        setUser(res.data.updatedUser)
      }
    }
    catch (err) {
      console.log(err.response.data.message);
    }
  }
  const onDislike = async ()=>{
    try{
      !user && navigate("/login");
      if(user.disliked?.includes(video?._id)){
        const res = await axios.put(`${config.backendUrl}/users/removedislike`, {
          userId: user._id,
          videoId: video._id
        });
        setVideo(res.data.updatedVideo);
        setUser(res.data.updatedUser)
      }
      else{
        const res = await axios.put(`${config.backendUrl}/users/addDislike`, {
          userId: user._id,
          videoId: video._id
        });
        setVideo(()=> { return res.data.updatedVideo });
        setUser(()=> { return res.data.updatedUser });
        if(user.liked?.includes(video?._id)){
          const res = await axios.put(`${config.backendUrl}/users/removelike`, {
            userId: user._id,
            videoId: video._id
          });
          setVideo(res.data.updatedVideo);
          setUser(res.data.updatedUser);
        }
      }
    }
    catch (err) { console.log(err.response.data.message); }
  }

  const onEndPage = async () => {
    try {
      const res = await axios.get(`${config.backendUrl}/videos/byTag/${videoList.length}/${selectedTagType}/${selectedTagValue}`);
      setVideoList([...videoList, ...res.data]);
    } catch (err) { console.log(err.response.data.message); }
  };

  const onDelete = async () => {
    try {
      await axios.delete(`${config.backendUrl}/videos/${video?._id}`);
      navigate("/");
    }
    catch (err) { console.log(err.response.data.message); }
  };

  const getVideosByTag = async () => {
    try {
        const res = await axios.get(`${config.backendUrl}/videos/byTag/0/${selectedTagType}/${selectedTagValue}`);
        setVideoList(res.data);
    } catch (err) { console.log(err); }
  };

  useEffect(()=>{ getVideosByTag(); }, [selectedTagType, selectedTagValue]);

  useEffect(()=> {
    const getVideo = async () => {
      try {
        const res = await axios.get(`${config.backendUrl}/videos${id}`);
        setVideo(res.data);
        const channelres = await axios.get(`${config.backendUrl}/channels${res.data.channel}`);
        setChannel(channelres.data);
      }
      catch (err) { console.log(err.response.data.message); }
    };
    getVideo();
    getVideosByTag();

    const addView = async () => {
      try {
        const res = await axios.put(`${config.backendUrl}/users/addview`, {userId: user._id, videoId: id});
        setUser(res.data);
      }
      catch (err) { console.log(err.response.data.message); }
    };
    setTimeout(function() {addView() }, 5000);
  }, []);

  const timeformat = (timestamp)=> {
    const date = new Date(timestamp);

    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');

    const formattedTimestamp = `${hours}:${minutes} ${day}.${month}`;
    return formattedTimestamp;
  }

  return (
    <div className="main-container">
      <HeaderProvider><Header/></HeaderProvider>
      <div className="video-page" onScroll={(e)=>{
        if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight -2) {
          onEndPage();
        }
      }}>
        <div className="video-main">
          <div className="video-screen">
            <video className="video-screen" autoplay controls src={`${config.backendUrl}/${video?.videoUrl}`} type="video/mp4"></video>
          </div>
          <label style={{ fontSize: 20 }}>{video?.title}</label>
          <div className="video-header">
            <div className="author-data">
              <img className="channel-icon" src={`${config.backendUrl}/${channel?.avatar}`} alt="channel" />
              <div className="channel-data">
                <Link to={"/channel/"+channel?._id}>{channel?.name}</Link>
                <span>{channel?.subscribers.length}</span>
              </div>
              {user?._id != channel?.user && ( user?.subscribedChannels.includes(channel?._id) ?
              <button className="subscribe-button" style={{ background: "black" }} onClick={()=>onSubscribe()}>Subscribed</button>
              : <button className="subscribe-button" onClick={()=>onSubscribe()}>Subscribe</button>
              )}
            </div>
            {user?._id == channel?.user &&
              <button className="subscribe-button" style={{ background: "black" }} onClick={()=>onDelete()}>Delete Video</button>
            }
            {user?._id != channel?.user && <div className="like-section">
              <button className="like-button" onClick={()=>onLike()} style={{ borderRight: "2px grey solid" }}>
                {user?.liked?.includes(video?._id) ? <AiFillLike className="like-icon"/> : <AiOutlineLike className="like-icon"/> }
                {video?.likes}
              </button>
              <button className="like-button" onClick={()=>onDislike()}>
                {user?.disliked?.includes(video?._id) ? <AiFillDislike className="like-icon"/> : <AiOutlineDislike className="like-icon"/> }
                {video?.dislikes}
              </button>
            </div>}
          </div>
          <div className="video-desc">
            <div className="video-views">
              <label>{video?.views} views</label>
              <label>{timeformat(video?.createdAt)}</label>
            </div>
            <div className="tags">
              {video?.tags.map(tag =>{
                return <span>#{tag}</span>;
              })}
            </div>
            <label style={{ wordWrap: "break-word" }}>
              {video?.description}
            </label>
          </div>
          {/* <div className="comment-section">
            <div className="comment-count"></div>
            <div className="comment-input"></div>
            <div className="comment-list">

            </div>
          </div> */}
        </div>
        <div className="next-video-bar">
          <GanreBar tags={video?.tags} author={channel}/>
          <div>
            {videoList?.map(video =>{ return <NextVideoElement key={video._id} video={video} showDesc={false}/> })}
          </div>
        </div>
      </div>
    </div>
  );
}