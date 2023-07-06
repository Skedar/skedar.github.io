const Home = () => {
  return (
    <section className="home image" id="home">
      <div>
        <div className="position-relative">
          <h1>
            <span>
              <span className="animated-layer">
                Olá<span>.</span>
              </span>
            </span>
            <span className="position-relative">
              <span className="animated-layer">Sou o</span>
              
            </span>
            <span>
              <span className="animated-layer">Luis</span>
            </span>
            <span className="intro animated-layer">
                Front-end Developer with 7 years experience based in London
              </span>
          </h1>
        </div>
      </div>
      {/* CALL TO ACTION STARTS */}
      <span className="animated-layer animated-btn cta" id="cta">
        <span></span>
      </span>
      {/* CALL TO ACTION ENDS */}
    </section>
  );
};
export default Home;
