const Copyright = () => {
  return (
    <section className="copyright">
      <img
        alt=""
        className="z-1 hide-mobile"
        src="assets/separator-copyright.png"
      />
      <div>
        <span>© {new Date().getFullYear()}<a href="https://skedarcorp.com"> Luis "Skedar" Rizzi</a></span>
        
        <ul>
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
