const Facts = () => {
  return (
    <section className="facts">
      <div className="flex-column-mobile">
        {/* SINGE FACT ITEM STARTS */}
        <div
          className="animated-layer fade-in-right-animation fadeInLeft wow"
          data-wow-offset={200}
        >
          <div>
            <div>
              <h3>12+</h3>
              <p>
                anos de<span>experiência</span> em TI
              </p>
            </div>
          </div>
        </div>
        {/* SINGE FACT ITEM ENDS */}
        {/* SINGE FACT ITEM STARTS */}
        <div
          className="animated-layer fade-in-right-animation fadeInRight wow"
          data-wow-offset={200}
        >
          <div>
            <div>
              <h3>23</h3>
              <p>
                Projetos<span>Desenvolvidos</span>
              </p>
            </div>
          </div>
        </div>
        {/* SINGE FACT ITEM ENDS */}
        {/* SINGE FACT ITEM STARTS */}
        <div
          className="animated-layer fade-in-right-animation fadeInLeft wow"
          data-wow-offset={200}
        >
          <div>
            <div>
              <h3>4</h3>
              <p>
                Jogos<span>lançados</span>
              </p>
            </div>
          </div>
        </div>
        {/* SINGE FACT ITEM ENDS */}
        {/* SINGE FACT ITEM STARTS */}
        <div
          className="animated-layer fade-in-right-animation fadeInRight wow"
          data-wow-offset={200}
        >
          <div>
            <div>
              <h3>2</h3>
              <p>
                Trabalhos<span>voluntários</span> em QA
              </p>
            </div>
          </div>
        </div>
        {/* SINGE FACT ITEM ENDS */}
      </div>
      <img
        alt=""
        className="z-1 hide-mobile opposite-separator"
        src="assets/separator-opposite.png"
      />
    </section>
  );
};
export default Facts;
