import React from 'react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    const divStyle = { paddingTop: '15px', paddingBottom: '15px', marginTop: '50px' };
    return (
        <footer>
          <div style={divStyle} className="ui center aligned container">
            <hr />
            Hawaii H.O.M.E. Project <br />
            Homeless Outreach & Medical Education<br />
            <a href="https://sites.google.com/view/hawaiihomeproject/about?authuser=0"> Learn more </a>
          </div>
        </footer>
    );
  }
}

export default Footer;
