import React from 'react';
import { connect } from 'react-redux';
import { State } from '../type';

interface Props {
  footer: String;
}

const Footer: React.FC<Props> = (props: Props) => {
  return <footer className="footer">{props.footer}</footer>;
};

export default connect(
  (state: State) => ({
    footer: state.locale.footer,
  }),
  null
)(Footer);
