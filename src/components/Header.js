const Header = () => {
  return (
    <header>
      {/* Desktop Menu Starts */}
      <div className="header-inner hide-mobile">
        {/* MENU STARTS */}
        <div className="menu">
          <nav>
            <ul>
              <li>
                <span className="active" id="home-link">
                  Home
                </span>
              </li>
              <li>
                <span id="about-link">Sobre</span>
              </li>
              <li>
                <span id="portfolio-link">Projetos</span>
              </li>
              <li>
                <span id="contact-link">Contato</span>
              </li>
              <li>
                 {/* MENU BLOG PAGINA= <span id="blog-link">Blog</span> */}
                <span><a href="https://skedarcorp.com/blog">Blog</a></span>
              </li>
            </ul>
          </nav>
        </div>
        {/* MENU ENDS */}
        {/* FREELANCE STARTS 
        <div className="mail">
          <p>
            Email :<span> <a href="mailto:contato@skedarcorp.com">contato@skedarcorp.com</a></span>
          </p>
        </div>
        {/* FREELANCE ENDS */}
      </div>
      {/* Desktop Menu Ends */}
      {/* Mobile Menu Starts */}
      <nav className="mobile-menu">
        <div id="menuToggle">
          <input type="checkbox" id="checkboxmenu" />
          <span />
          <span />
          <span />
          <ul className="list-unstyled" id="menu">
            <li>
              <a href="#home">
                <span>Home</span>
              </a>
            </li>
            <li>
              <a href="#my-photo">
                <span>Sobre</span>
              </a>
            </li>
            <li>
              <a href="#portfolio">
                <span>Projetos</span>
              </a>
            </li>
            <li>
              <a href="#contact">
                <span>Contato</span>
              </a>
            </li>
            <li>
              <a href="#blog">
                <span>Blog</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
      {/* Mobile Menu Ends */}
    </header>
  );
};
export default Header;
