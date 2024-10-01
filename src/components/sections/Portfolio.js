import { salimovSlider } from "@/src/sliderProps";
import { Swiper, SwiperSlide } from "swiper/react";

const Portfolio = () => {
  return (
    <section
      className="portfolio main-section flex-column-mobile" id="portfolio">
      {/* TITLE STARTS */}
      <div className="custom-title">
        {/* MAIN TITLE STARTS */}
        <h3>
          <span>
            <span className="animated-layer fade-in-left-animation fadeInUp wow">
              Projetos
            </span>
          </span>
        </h3>
        {/* MAIN TITLE ENDS */}
      </div>
      {/* TITLE ENDS */}
      <Swiper
        {...salimovSlider.portfolio}
        className="swiper swiper-portfolio animated-layer fade-in-right-animation fadeInUp wow"
        data-wow-offset={200}
      >
        {/* PORTFOLIO ITEM STARTS */}
        <SwiperSlide className="single-item swiper-slide">
          {/* ITEM MAIN CONTENT STARTS */}
          <div className="main-content">
            <Swiper
              {...salimovSlider.portfolioItems}
              className="swiper swiper-portfolio-item"
            >
              <SwiperSlide className="swiper-slide">
                <img src="assets/portfolio/project-2.jpg" title="img" />
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <img src="assets/portfolio/project-3.jpg" title="img" />
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <img src="assets/portfolio/project-1.jpg" title="img" />
              </SwiperSlide>
              <div className="swiper-pagination" />
            </Swiper>
          </div>
          {/* ITEM MAIN CONTENT ENDS */}
          {/* ITEM DETAILS STARTS */}
          <div className="details">
            <h4>Brukutu Motos</h4>
            <div>
              <ul>
                <li>
                  <span>
                    <i className="fa-regular fa-file-lines" /> Projeto :
                  </span>
                  <span>Site e Descritivo</span>
                </li>
                <li>
                  <span>
                    <i className="fa-regular fa-user" /> Cliente :
                  </span>
                  <span>José Roberto</span>
                </li>
                <li>
                  <span>
                    <i className="fa-regular fa-hourglass" /> Duração :
                  </span>
                  <span>2 meses</span>
                </li>
                <li>
                  <span>
                    <i className="fa-solid fa-code-branch" /> Frameworks :
                  </span>
                  <span>Wordpress, JS, Photoshop, Illustrator</span>
                </li>
              </ul>
            </div>
            <a href="https://brukutumotos.com.br" target="_blank" className="custom-btn">
              <span>
                preview <i className="fa-solid fa-arrow-up-right-from-square" />
              </span>
            </a>
          </div>
          {/* ITEM DETAILS ENDS */}
        </SwiperSlide>
        {/* PORTFOLIO ITEM ENDS */}
        {/* PORTFOLIO ITEM STARTS */}
        <SwiperSlide className="single-item swiper-slide">
          {/* ITEM MAIN CONTENT STARTS */}
          <div className="main-content">
            <img
              className="img-fluid"
              src="assets/portfolio/project-1.jpg"
              alt="Image Project"
            />
          </div>
          {/* ITEM MAIN CONTENT ENDS */}
          {/* ITEM DETAILS STARTS */}
          <div className="details">
            <h4>Diversão Educativa</h4>
            <div>
              <ul>
                <li>
                  <span>
                    <i className="fa-regular fa-file-lines" /> Projeto :
                  </span>
                  <span>Portal para Alfabetização Tecnológica</span>
                </li>
                <li>
                  <span>
                    <i className="fa-regular fa-user" /> Cliente :
                  </span>
                  <span>Projeto Pessoal</span>
                </li>
                <li>
                  <span>
                    <i className="fa-regular fa-hourglass" /> Duração :
                  </span>
                  <span><i class="fa-solid fa-infinity"></i></span>
                </li>
                <li>
                  <span>
                    <i className="fa-solid fa-code-branch" /> Frameworks :
                  </span>
                  <span>HTML5, Construct, Godot</span>
                </li>
              </ul>
            </div>
            <a href="https://diversaoeducativa.com.br" target="_blank" className="custom-btn">
              <span>
                Visitar <i className="fa-solid fa-arrow-up-right-from-square" />
              </span>
            </a>
          </div>
          {/* ITEM DETAILS ENDS */}
        </SwiperSlide>
        {/* PORTFOLIO ITEM ENDS */}
        {/* PORTFOLIO ITEM STARTS */}
        <SwiperSlide className="single-item swiper-slide">
          {/* ITEM MAIN CONTENT STARTS */}
          <div className="main-content">
            <div className="videocontainer">
              <iframe
                className="youtube-video"
                src="https://www.youtube.com/embed/AqcjdkPMPJA?enablejsapi=1&version=3&playerapiid=ytplayer"
                allowFullScreen=""
              />
            </div>
          </div>
          {/* ITEM MAIN CONTENT ENDS */}
          {/* ITEM DETAILS STARTS */}
          <div className="details">
            <h4>Barbara Dobre</h4>
            <div>
              <ul>
                <li>
                  <span>
                    <i className="fa-regular fa-file-lines" /> Projeto :
                  </span>
                  <span>Site e Loja Virtual</span>
                </li>
                <li>
                  <span>
                    <i className="fa-regular fa-user" /> Cliente :
                  </span>
                  <span>Barbara</span>
                </li>
                <li>
                  <span>
                    <i className="fa-regular fa-hourglass" /> Duração :
                  </span>
                  <span>8 meses</span>
                </li>
                <li>
                  <span>
                    <i className="fa-solid fa-code-branch" /> Frameworks :
                  </span>
                  <span>Wordpress, Photoshop, Illustrator</span>
                </li>
              </ul>
            </div>
            <a href="#" target="_blank" className="custom-btn">
              <span>
                preview <i className="fa-solid fa-arrow-up-right-from-square" />
              </span>
            </a>
          </div>
          {/* ITEM DETAILS ENDS */}
        </SwiperSlide>
        {/* PORTFOLIO ITEM ENDS */}
        {/* PORTFOLIO ITEM STARTS */}
        <SwiperSlide className="single-item swiper-slide">
          {/* ITEM MAIN CONTENT STARTS */}
          <div className="main-content">
            <Swiper
              {...salimovSlider.portfolioItems}
              className="swiper swiper-portfolio-item"
            >
              <SwiperSlide className="swiper-slide">
                <img src="assets/portfolio/project-2.jpg" title="img" />
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <img src="assets/portfolio/project-3.jpg" title="img" />
              </SwiperSlide>
              <SwiperSlide className="swiper-slide">
                <img src="assets/portfolio/project-1.jpg" title="img" />
              </SwiperSlide>
              <div className="swiper-pagination" />
            </Swiper>
          </div>
          {/* ITEM MAIN CONTENT ENDS */}
          {/* ITEM DETAILS STARTS */}
          <div className="details">
            <h4>Neon Shelter</h4>
            <div>
              <ul>
                <li>
                  <span>
                    <i className="fa-regular fa-file-lines" /> Projeto :
                  </span>
                  <span>Game Mobile</span>
                </li>
                <li>
                  <span>
                    <i className="fa-regular fa-user" /> Cliente :
                  </span>
                  <span>Dead Pirate Studios</span>
                </li>
                <li>
                  <span>
                    <i className="fa-regular fa-hourglass" /> Duração :
                  </span>
                  <span>6 meses</span>
                </li>
                <li>
                  <span>
                    <i className="fa-solid fa-code-branch" /> Frameworks :
                  </span>
                  <span>Godot, Photoshop</span>
                </li>
              </ul>
            </div>
            <a href="#" target="_blank" className="custom-btn">
              <span>
                preview <i className="fa-solid fa-arrow-up-right-from-square" />
              </span>
            </a>
          </div>
          {/* ITEM DETAILS ENDS */}
        </SwiperSlide>
        {/* PORTFOLIO ITEM ENDS */}
        {/* PORTFOLIO ITEM STARTS */}
        <SwiperSlide className="single-item swiper-slide">
          {/* ITEM MAIN CONTENT STARTS */}
          <div className="main-content">
            <a
              href="https://themeforest.net"
              target="_blank"
              className="external"
            >
              <img
                className="img-fluid"
                src="assets/portfolio/project-3.jpg"
                alt="External Project"
              />
            </a>
          </div>
          {/* ITEM MAIN CONTENT ENDS */}
          {/* ITEM DETAILS STARTS */}
          <div className="details">
            <h4>Barbara Dobre</h4>
            <div>
              <ul>
                <li>
                  <span>
                    <i className="fa-regular fa-file-lines" /> Projeto :
                  </span>
                  <span>Site e Loja Virtual</span>
                </li>
                <li>
                  <span>
                    <i className="fa-regular fa-user" /> Cliente :
                  </span>
                  <span>Barbara Dobre</span>
                </li>
                <li>
                  <span>
                    <i className="fa-regular fa-hourglass" /> Duração :
                  </span>
                  <span>3 Meses</span>
                </li>
                <li>
                  <span>
                    <i className="fa-solid fa-code-branch" /> Frameworks :
                  </span>
                  <span>Wordpress, Photoshop</span>
                </li>
              </ul>
            </div>
            <a href="https://barbaradobre.com.br/" target="_blank" className="custom-btn">
              <span>
                preview <i className="fa-solid fa-arrow-up-right-from-square" />
              </span>
            </a>
          </div>
          {/* ITEM DETAILS ENDS */}
        </SwiperSlide>
        {/* PORTFOLIO ITEM ENDS */}
        <div className="nav-item next-item animated-btn">
          <span />
        </div>
        <div className="nav-item prev-item animated-btn">
          <span />
        </div>
      </Swiper>
      <img
        alt=""
        className="separator hide-mobile"
        src="assets/separator.png"
      />
    </section>
  );
};
export default Portfolio;
