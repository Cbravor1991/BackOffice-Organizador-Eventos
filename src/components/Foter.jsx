import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Footer = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1500,
    slidesToShow: 3,
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
    <footer style={{ width: "100%", backgroundColor: '#000' , color: "#fff", textAlign: "center", padding: "50px 0" }}>
      <div className="container">
        <h3 style={{ marginBottom: "30px" }}>Crea los mejores eventos, ¡tú puedes!</h3>
        <Slider {...settings}>
          <div>
          <img src= {require('../images/imagen_6.jpeg')} alt="imagen 1" />
          </div>
          <div>
            <img src= {require('../images/imagen_1.jpeg')} alt="imagen 2" />
          </div>
          <div>
            <img src= {require('../images/imagen_2.jpeg')}  alt="imagen 3" />
          </div>
          <div>
            <img src={require('../images/imagen_3.jpeg')} alt="imagen 4" />
          </div>
          <div>
            <img src={require('../images/imagen_4.jpeg')}alt="imagen 5" />
          </div>
          <div>
            <img src={require('../images/imagen_5.jpeg')} alt="imagen 6" />
          </div>
        </Slider>
      </div>
    </footer>
  );
};

export default Footer;
