import React from "react";
import { Link } from "react-scroll";
import { MOBILE_NAV } from "../../constants";

const MobileNav = () => (
  <nav className="mobile-nav md:hidden" aria-label="Section navigation">
    <div className="mobile-nav__dock">
      {MOBILE_NAV.map(({ label, to, Icon, offset }) => (
        <Link
          key={to}
          to={to}
          smooth
          spy
          activeClass="active"
          offset={offset}
          className="mobile-nav__item group"
          aria-label={label}
        >
          <Icon size={18} />
          <span className="mobile-nav__tooltip">{label}</span>
        </Link>
      ))}
    </div>
  </nav>
);

export default MobileNav;
