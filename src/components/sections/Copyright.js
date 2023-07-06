const Copyright = () => {
  return (
    <section className="copyright">
      <img
        alt=""
        className="z-1 hide-mobile"
        src="assets/separator-copyright.png"
      />
      <div>
        <span>© {new Date().getFullYear()} Luis "Skedar" Rizzi</span>
        
        <ul>
          <li>
            <a href="https://github.com/Skedar">
              <i className="fa-brands fa-github" />
            </a>
          </li>
          <li>
            <a href="https://twitter.com/skedarcorp">
              <i className="fa-brands fa-twitter" />
            </a>
          </li>
          <li>
            <a href="https://web.facebook.com/skedarcorp">
              <i className="fa-brands fa-facebook" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
};
export default Copyright;
