import { HiDownload } from "react-icons/hi";

const Photos = () => {
  return (
    <div className="photo-items-container">
      <figure className="photo-item">
        <img
          src="https://www.wallpaperbetter.com/wallpaper/363/725/213/white-cat-cute-1080P-wallpaper.jpg"
          alt=""
        />

        <figcaption className="photo-description">
          <h4>photo_2024_2.png</h4>
          <div className="icon">
            <HiDownload />
          </div>
        </figcaption>
      </figure>
    </div>
  );
};

export default Photos;
