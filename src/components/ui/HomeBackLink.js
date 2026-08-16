import React from "react";
import { Link } from "react-router-dom";
import { getHomeBackLink, getHomeBackState } from "../../utils/homeScroll";

/** Back link that returns to home at the Work / projects section. */
const HomeBackLink = ({ children, ...props }) => (
  <Link to={getHomeBackLink()} state={getHomeBackState()} {...props}>
    {children}
  </Link>
);

export default HomeBackLink;
