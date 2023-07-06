const About = () => {
  return (
    <section className="about main-section flex-column-mobile" id="about">
      {/* INFO HOLDER STARTS */}
      <div className="info flex-column-mobile">
        {/* IMAGE STARTS */}
        <div
          className="img-container animated-layer image-animation my-photo-container fadeInUp wow"
          data-wow-offset={200}
          id="my-photo"
        >
          <div>
            <div>
              <img className="my-photo" src="assets/about.jpg" alt="" />
            </div>
          </div>
        </div>
        {/* IMAGE ENDS */}
        {/* INFO STARTS */}
        <div>
          <h2>Luis
              <span className="animated-layer fade-in-up-animation fadeInUp wow">
             Skedar</span>  
              <span className="animated-layer fade-in-up-animation fadeInUp wow">
                Rizzi
              </span>
          </h2>
          <div className="infos">
            <ul>
              <li>
                <span>
                  <span className="animated-layer fade-in-up-animation fadeInUp wow">
                    <span>Idade :</span>
                    <span>33 Anos</span>
                  </span>
                </span>
              </li>
              <li>
                <span>
                  <span className="animated-layer fade-in-up-animation fadeInUp wow">
                    <span>Nacionalidade :</span>
                    <span>Brasileiro</span>
                  </span>
                </span>
              </li>
              <li>
                <span>
                  <span className="animated-layer fade-in-up-animation fadeInUp wow">
                    <span>Freelance :</span>
                    <span>Disponível</span>
                  </span>
                </span>
              </li>
              <li>
                <span>
                  <span className="animated-layer fade-in-up-animation fadeInUp wow">
                    <span>Idiomas :</span>
                    <span>Português | Inglês</span>
                  </span>
                </span>
              </li>
            </ul>
            <ul>
              <li>
                <span>
                  <span className="animated-layer fade-in-up-animation fadeInUp wow">
                    <span>Endereço :</span>
                    <span>Ribeirão Preto - SP</span>
                  </span>
                </span>
              </li>
              <li>
                <span>
                  <span className="animated-layer fade-in-up-animation fadeInUp wow">
                    <span>LinkedIn :</span>
                    <span><a href="https://www.linkedin.com/in/skedarcorp/">
                    Luis "Skedar" Rizzi
                </a></span>
                  </span>
                </span>
              </li>
              <li>
                <span>
                  <span className="animated-layer fade-in-up-animation fadeInUp wow">
                    <span>Email :</span>
                    <span><a href="mailto:contato@skedarcorp.com">contato@skedarcorp.com</a></span>
                  </span>
                </span>
              </li>
              <li>
                <span>
                  <span className="animated-layer fade-in-up-animation fadeInUp wow">
                    <span>Discord :</span>
                    <span>skedarcorp</span>
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>
        {/* INFO ENDS */}
      </div>
      {/* INFO HOLDER ENDS */}
      {/* SKILLS STARTS */}
      <div className="skills flex-column-mobile">
        {/* TITLE STARTS */}
        <div className="custom-title">
          {/* MAIN TITLE STARTS */}
          <h3>
            <span>
              <span className="animated-layer fade-in-left-animation fadeInUp wow">
                My Skills
              </span>
            </span>
          </h3>
          {/* MAIN TITLE ENDS */}
        </div>
        {/* TITLE ENDS */}
        <div className="skills-content">
          <div>
            {/* SKILL ITEM STARTS */}
            <div className="animated-layer fade-in-down-animation fadeInLeft wow">
              <span>
                <i className="devicon-unity-original" />
              </span>
              <h4>Unity</h4>
            </div>
            {/* SKILL ITEM ENDS */}
            {/* SKILL ITEM STARTS */}
            <div className="animated-layer fade-in-up-animation fadeInRight wow">
              <span>
                <i className="devicon-unrealengine-original" />
              </span>
              <h4>Unreal Engine</h4>
            </div>
            {/* SKILL ITEM ENDS */}
          </div>
          <div>
            {/* SKILL ITEM STARTS */}
            <div className="animated-layer fade-in-down-animation fadeInLeft wow">
              <span>
                <i className="devicon-unrealengine-original" />
              </span>
              <h4>Constructor</h4>
            </div>
            {/* SKILL ITEM ENDS */}
            {/* SKILL ITEM STARTS */}
            <div className="animated-layer fade-in-up-animation fadeInRight wow">
              <span>
                <i className="devicon-androidstudio-plain" />
              </span>
              <h4>Android Studio</h4>
            </div>
            {/* SKILL ITEM ENDS */}
          </div>
          <div>
            {/* SKILL ITEM STARTS */}
            <div className="animated-layer fade-in-down-animation fadeInLeft wow">
              <span>
                <i className="devicon-html5-plain" />
              </span>
              <h4>HTML5</h4>
            </div>
            {/* SKILL ITEM ENDS */}
            {/* SKILL ITEM STARTS */}
            <div className="animated-layer fade-in-up-animation fadeInRight wow">
              <span>
                <i className="devicon-docker-plain" />
              </span>
              <h4>Docker</h4>
            </div>
            {/* SKILL ITEM ENDS */}
          </div>
          <div>
            {/* SKILL ITEM STARTS */}
            <div className="animated-layer fade-in-down-animation fadeInLeft wow">
              <span>
                <i className="devicon-csharp-plain" />
              </span>
              <h4>CSharp</h4>
            </div>
            {/* SKILL ITEM ENDS */}
            {/* SKILL ITEM STARTS */}
            <div className="animated-layer fade-in-up-animation fadeInRight wow">
              <span>
                <i className="devicon-java-plain" />
              </span>
              <h4>Java</h4>
            </div>
            {/* SKILL ITEM ENDS */}
          </div>
        </div>
      </div>
      {/* SKILLS ENDS */}
      {/* RESUME STARTS */}
      <div className="resume flex-column-mobile">
        {/* TITLE STARTS */}
        <div className="custom-title fadeInUp wow">
          {/* MAIN TITLE STARTS */}
          <h3>
            <span>
              <span className="animated-layer fade-in-left-animation">
                Timeline
              </span>
            </span>
          </h3>
          {/* MAIN TITLE ENDS */}
        </div>
        {/* TITLE ENDS */}
        {/* TIMELINE STARTS */}
        <div className="timeline">
          <ol className="animated-layer fade-in-animation">
            {/* TIMELINE ITEM STARTS */}
            <li>
              <div className="animated-layer fade-in-down-animation fadeInUp wow">
                <div className="experience">
                  <h4>Técnico em Hardware</h4>
                  <p>
                    <i className="fa-regular fa-clock" />
                    <span>2006 - 2009</span>
                  </p>
                  <p>
                    <i className="fa-regular fa-building" />
                    <span>Freelance</span>
                  </p>
                </div>
              </div>
            </li>
            {/* TIMELINE ITEM ENDS */}
            {/* TIMELINE ITEM STARTS */}
            <li>
              <div className="animated-layer fade-in-down-animation fadeInUp wow">
                <div className="experience">
                  <h4>Técnico em Hardware</h4>
                  <p>
                    <i className="fa-regular fa-clock" />
                    <span>2009 - 2011</span>
                  </p>
                  <p>
                    <i className="fa-regular fa-building" />
                    <span>Fortran Computadores</span>
                  </p>
                </div>
              </div>
            </li>
            {/* TIMELINE ITEM ENDS */}
            {/* TIMELINE ITEM STARTS */}
            <li>
              <div className="animated-layer fade-in-down-animation fadeInUp wow">
                <div className="experience">
                  <h4>Técnico em Hardware</h4>
                  <p>
                    <i className="fa-regular fa-clock" />
                    <span>2009 - 2011</span>
                  </p>
                  <p>
                    <i className="fa-regular fa-building" />
                    <span>Positivo Informática</span>
                  </p>
                </div>
              </div>
            </li>
            {/* TIMELINE ITEM ENDS */}
            {/* TIMELINE ITEM STARTS */}
            <li>
              <div className="animated-layer fade-in-up-animation fadeInUp wow">
                <div className="education">
                  <h4>Sup. em Gestor em TI</h4>
                  <p>
                    <i className="fa-regular fa-clock" />
                    <span>2012</span>
                  </p>
                  <p>
                    <i className="fa-solid fa-building-columns" />
                    <span>Universidade Moura Lacerda</span>
                  </p>
                </div>
              </div>
            </li>
            {/* TIMELINE ITEM ENDS */}
            {/* TIMELINE ITEM STARTS */}
            <li>
              <div className="animated-layer fade-in-up-animation fadeInUp wow">
                <div className="education">
                  <h4>Sup. em Análise de Sistemas</h4>
                  <p>
                    <i className="fa-regular fa-clock" />
                    <span>2013</span>
                  </p>
                  <p>
                    <i className="fa-solid fa-building-columns" />
                    <span>Universidade Moura Lacerda</span>
                  </p>
                </div>
              </div>
            </li>
            {/* TIMELINE ITEM ENDS */}
            {/* TIMELINE ITEM STARTS */}
            <li>
              <div className="animated-layer fade-in-up-animation fadeInUp wow">
                <div className="experience">
                  <h4>Técnico em Hardware</h4>
                  <p>
                    <i className="fa-regular fa-clock" />
                    <span>2012 - 2013</span>
                  </p>
                  <p>
                    <i className="fa-regular fa-building" />
                    <span>Cajuela Informática</span>
                  </p>
                </div>
              </div>
            </li>
            {/* TIMELINE ITEM ENDS */}
            {/* TIMELINE ITEM STARTS */}
            <li>
              <div className="animated-layer fade-in-down-animation fadeInUp wow">
                <div className="experience">
                  <h4>Técnico em Hardware</h4>
                  <p>
                    <i className="fa-regular fa-clock" />
                    <span>2012 - 2013</span>
                  </p>
                  <p>
                    <i className="fa-regular fa-building" />
                    <span>Ponto Com. Informática</span>
                  </p>
                </div>
              </div>
            </li>
            {/* TIMELINE ITEM ENDS */}
            {/* TIMELINE ITEM STARTS */}
            <li>
              <div className="animated-layer fade-in-down-animation fadeInUp wow">
                <div className="experience">
                  <h4>Gestor em TI</h4>
                  <p>
                    <i className="fa-regular fa-clock" />
                    <span>2014 - 2015</span>
                  </p>
                  <p>
                    <i className="fa-regular fa-building" />
                    <span>Chiari Informática</span>
                  </p>
                </div>
              </div>
            </li>
            {/* TIMELINE ITEM ENDS */}
            {/* TIMELINE ITEM STARTS */}
            <li>
              <div className="animated-layer fade-in-down-animation fadeInUp wow">
                <div className="education">
                  <h4>Sup. em Jogos Digitais</h4>
                  <p>
                    <i className="fa-regular fa-clock" />
                    <span>2015</span>
                  </p>
                  <p>
                    <i className="fa-solid fa-building-columns" />
                    <span>Universidade Barão de Maua</span>
                  </p>
                </div>
              </div>
            </li>
            {/* TIMELINE ITEM ENDS */}
            {/* TIMELINE ITEM STARTS */}
            <li>
              <div className="animated-layer fade-in-down-animation fadeInUp wow">
                <div className="education">
                  <h4>Pós-Graduação em Game Design</h4>
                  <p>
                    <i className="fa-regular fa-clock" />
                    <span>2015</span>
                  </p>
                  <p>
                    <i className="fa-solid fa-building-columns" />
                    <span>Universidade Positivo</span>
                  </p>
                </div>
              </div>
            </li>
            {/* TIMELINE ITEM ENDS */}
            {/* TIMELINE ITEM STARTS */}
            <li>
              <div className="animated-layer fade-in-down-animation fadeInUp wow">
                <div className="experience">
                  <h4>Gestor em TI</h4>
                  <p>
                    <i className="fa-regular fa-clock" />
                    <span>2015 - 2019</span>
                  </p>
                  <p>
                    <i className="fa-regular fa-building" />
                    <span>Senhora Casa Imóveis</span>
                  </p>
                </div>
              </div>
            </li>
            {/* TIMELINE ITEM ENDS */}
            {/* TIMELINE ITEM STARTS */}
            <li>
              <div className="animated-layer fade-in-down-animation fadeInUp wow">
                <div className="experience">
                  <h4>Game Designer</h4>
                  <p>
                    <i className="fa-regular fa-clock" />
                    <span>2017 - Atualmente</span>
                  </p>
                  <p>
                    <i className="fa-regular fa-building" />
                    <span>Dead Pirate Studios</span>
                  </p>
                </div>
              </div>
            </li>
            {/* TIMELINE ITEM ENDS */}
            {/* TIMELINE ITEM STARTS */}
            <li>
              <div className="animated-layer fade-in-down-animation fadeInUp wow">
                <div className="experience">
                  <h4>Empreendedor</h4>
                  <p>
                    <i className="fa-regular fa-clock" />
                    <span>2018 - Atualmente</span>
                  </p>
                  <p>
                    <i className="fa-regular fa-building" />
                    <span>Loja Necromantis</span>
                  </p>
                </div>
              </div>
            </li>
            {/* TIMELINE ITEM ENDS */}
            {/* TIMELINE ITEM STARTS */}
            <li>
              <div className="animated-layer fade-in-down-animation fadeInUp wow">
                <div className="experience">
                  <h4>Game Designer</h4>
                  <p>
                    <i className="fa-regular fa-clock" />
                    <span>2022 - Atualmente</span>
                  </p>
                  <p>
                    <i className="fa-regular fa-building" />
                    <span>Turma do Saber</span>
                  </p>
                </div>
              </div>
            </li>
            {/* TIMELINE ITEM ENDS */}
            {/* TIMELINE ITEM STARTS */}
            <li>
              <div className="animated-layer fade-in-down-animation fadeInUp wow">
                <div className="education">
                  <h4>Pós-Graduação em Eng. Soft. e QA </h4>
                  <p>
                    <i className="fa-regular fa-clock" />
                    <span>2022</span>
                  </p>
                  <p>
                    <i className="fa-solid fa-building-columns" />
                    <span>Anhanguera</span>
                  </p>
                </div>
              </div>
            </li>
            {/* TIMELINE ITEM ENDS */}
            {/* TIMELINE ITEM STARTS */}
            <li>
              <div className="animated-layer fade-in-down-animation fadeInUp wow">
                <div className="education">
                  <h4>MBA em Gestão da Qualidade</h4>
                  <p>
                    <i className="fa-regular fa-clock" />
                    <span>2023</span>
                  </p>
                  <p>
                    <i className="fa-solid fa-building-columns" />
                    <span>Universidade Anhanguera</span>
                  </p>
                </div>
              </div>
            </li>
            {/* TIMELINE ITEM ENDS */}
            {/* TIMELINE ITEM STARTS */}
            <li>
              <div className="animated-layer fade-in-down-animation fadeInUp wow">
                <div className="experience">
                  <h4>Monitor de Informática</h4>
                  <p>
                    <i className="fa-regular fa-clock" />
                    <span>2023 - Atualmente</span>
                  </p>
                  <p>
                    <i className="fa-regular fa-building" />
                    <span>MSTech</span>
                  </p>
                </div>
              </div>
            </li>
            {/* TIMELINE ITEM ENDS */}
            <li />
          </ol>
        </div>
        {/* TIMELINE ENDS */}
      </div>
      {/* RESUME ENDS */}
      <img
        alt=""
        className="separator hide-mobile"
        src="assets/separator.png"
      />
    </section>
  );
};
export default About;
