const Contact = () => {
  return (
    <section className="contact main-section flex-column-mobile" id="contact">
      {/* TITLE STARTS */}
      <div className="custom-title">
        {/* MAIN TITLE STARTS */}
        <h3>
          <span>
            <span className="animated-layer fade-in-left-animation fadeInUp wow">
              Contato
            </span>
          </span>
        </h3>
        {/* MAIN TITLE ENDS */}
      </div>
      {/* TITLE ENDS */}
      {/* CONTACTS STARTS */}
      <div className="boxes">
        <div>
          {/* CONTACT ITEM STARTS */}
          <div className="animated-layer fade-in-down-animation fadeInUp wow">
            <i className="fa-solid fa-link" />
            <p>
              <span className="small-text">Todos os Links</span>
              <a href="https://everlink.tools/skedar">
                 -Clique Aqui-
                </a>
            </p>
          </div>
          {/* CONTACT ITEM ENDS */}
          {/* CONTACT ITEM STARTS */}
          <div className="animated-layer fade-in-up-animation fadeInUp wow">
            <i className="fa-brands fa-telegram" />
            <p>
              <span className="small-text">Telegram</span>
              <a href="https://t.me/skedar">
              t.me/skedar
                </a>
            </p>
          </div>
          {/* CONTACT ITEM ENDS */}
        </div>
        <div>
          {/* CONTACT ITEM STARTS */}
          <div className="animated-layer fade-in-down-animation fadeInUp wow">
            <i className="fa fa-envelope" />
            <p>
              <span className="small-text">email</span>
              <a href="mailto:contato@skedarcorp.com">contato@skedarcorp.com</a>
            </p>
          </div>
          {/* CONTACT ITEM ENDS */}
          {/* CONTACT ITEM STARTS */}
          <div className="animated-layer fade-in-up-animation fadeInUp wow">
            <i className="fa fa-share-nodes" />
            <span className="small-text">social</span>
            <ul className="social">
              <li>
                <a href="https://skedarcorp.com">
                  <i className="fa-solid fa-globe" />
                </a>
              </li>
              <li>
                <a href="https://github.com/Skedar">
                  <i className="fa-brands fa-github" />
                </a>
              </li>
              <li>
                <a href="https://bsky.app/profile/skedar.bsky.social">
                  <i className="fa-brands fa-bluesky" />
                </a>
              </li>
              <li>
                <a href="https://facebook.com/skedarcorp">
                  <i className="fa-brands fa-facebook" />
                </a>
              </li>
            </ul>
          </div>
          {/* CONTACT ITEM ENDS */}
        </div>
      </div>
      {/* CONTACTS ENDS */}
      
    </section>
  );
};
export default Contact;
