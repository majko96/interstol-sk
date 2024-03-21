import React from 'react';
const YoutubeEmbed = (embedId) => {
    return (
            <div className="video-responsive">
                <iframe
                    width="853"
                    height="480"
                    src={`https://www.youtube.com/embed/${embedId.videoId}`}
                    frameBorder="0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Embedded youtube"
                />
            </div>
        )
    }
;

export default YoutubeEmbed;