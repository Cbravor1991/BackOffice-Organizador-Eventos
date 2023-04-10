import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Footer = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <footer>
      <div className="container">
        <h3>Galería de imágenes</h3>
        <Slider {...settings}>
          <div>
            <img src="https://picsum.photos/200/300" alt="imagen 1" />
          </div>
          <div>
            <img src="https://picsum.photos/200/301" alt="imagen 2" />
          </div>
          <div>
            <img src="https://picsum.photos/200/302" alt="imagen 3" />
          </div>
          <div>
            <img src="https://picsum.photos/200/303" alt="imagen 4" />
          </div>
          <div>
            <img src="https://picsum.photos/200/304" alt="imagen 5" />
          </div>
          <div>
            <img src="https://picsum.photos/200/305" alt="imagen 6" />
          </div>
        </Slider>
      </div>
    </footer>
  );
};

export default Footer;
