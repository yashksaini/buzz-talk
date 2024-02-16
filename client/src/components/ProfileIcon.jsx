import { useEffect, useState } from "react";
import PropTypes from "prop-types";
const ProfileIcon = ({ fullName }) => {
  const [initials, setInitials] = useState("");

  // Function to extract initials from the full name
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("");
  };
  useEffect(() => {
    const newInitials = getInitials(fullName);
    setInitials(newInitials);
  }, [fullName]);

  return <span className="text-xs font-bold text-primary">{initials}</span>;
};
ProfileIcon.propTypes = {
  fullName: PropTypes.string,
};

export default ProfileIcon;
