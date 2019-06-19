import React from 'react';
import { connect } from 'react-redux';
import { State } from '../type';

interface Props {
  header: String;
}

const Header: React.FC<Props> = (props: Props) => {
  return <header>{props.header}</header>;
};

export default connect(
  (state: State) => ({
    header: state.locale.header,
  }),
  null
)(Header);
