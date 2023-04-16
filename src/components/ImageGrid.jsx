import React from 'react';



const ImageGrid = ({ setSelectedImg }) => {
 
  let photos = JSON.parse(window.localStorage.getItem("photos_user"));


return (
  <div className="img-grid">
    {photos.map(function(url, index) {
      return (
        <div className='img-wrap' key={index} onClick={() => setSelectedImg(url)}>
          <img src={url} alt="uploaded pic" />
        </div>
      );
    })}
  </div>
);
}

export default ImageGrid;