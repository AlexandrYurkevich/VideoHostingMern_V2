import "./styles.css";
import { config } from "../../shared";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function NextVideoElement({video, showDesc}) {
  const [channel, setChannel] = useState(null);
  const [duration, setDuration] =  useState("");

  const timeformat = (timestamp)=> {
    const date = new Date(timestamp);

    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');

    const formattedTimestamp = `${hours}:${minutes} ${day}.${month}`;
    return formattedTimestamp;
  }
  
  useEffect(()=> {
    const getChannel = async () => {
      try {
        const res = await axios.get(`${config.backendUrl}/channels/${video.channel}`);
        setChannel(res.data);
      }
      catch (err) {
        console.log(err);
      }
    };
    getChannel();
  }, []);

  return (
    <div className="next-video-element">
      <Link className="thumbnail-container" to={`/watch/${video._id}`} >
        {video.thumbnail && <img className="next-video-thumbnail" src={`${config.backendUrl}/${video.thumbnail}`} alt="thumbnail"/>}
        <video style={video.thumbnail && {display: 'none'}} className="next-video-thumbnail" src={`${config.backendUrl}/${video.videoUrl}`}
        onLoadedMetadata={(e)=>{
          let duration = e.target.duration;
          let hours = Math.floor(duration / 3600);
          let minutes = Math.floor((duration % 3600) / 60);
          let seconds = Math.floor(duration % 60);
          if (hours < 10) {
            hours = '0' + hours;
          }
          if (minutes < 10) {
            minutes = '0' + minutes;
          }
          if (seconds < 10) {
            seconds = '0' + seconds;
          }
          setDuration((hours > 0 ? hours + ':' : '')+ minutes+':'+seconds)
        }}><label className="thumbnail-duration">{duration}</label></video>
      </Link>
      <div className="next-video-data">
        <Link to={`/watch/${video._id}`}>{video.title}</Link>
        <Link to={`/channel/${channel?._id}`}><span>{channel?.name}</span></Link>
        <div className="video-views-date">
          <span>{video.views} views</span>
          <span>•</span>
          <span>{timeformat(video.createdAt)}</span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>{video.tags?.map(tag =>{
          return <span>#{tag}</span>;
        })}</div>
        {showDesc && <label>{video.description}</label>}
      </div>
    </div>
  );
}