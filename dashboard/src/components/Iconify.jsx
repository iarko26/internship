'use client'
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";

const Iconify = ({ icon, width = 24, height = 24, ...other }) => {
  return <Icon icon={icon} width={width} height={height} {...other} />;
};

Iconify.propTypes = {
  icon: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default Iconify;