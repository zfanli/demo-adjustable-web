import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../type';

const Header: React.FC = () => {
  // get header string from store
  const header = useSelector((state: State) => state.locale.header);
  return <header className="header">{header}</header>;
};

export default Header;
