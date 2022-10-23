import React from 'react';

/** The Footer appears at the bottom of every page. Rendered by the App Layout component. */
class Footer extends React.Component {
  render() {
    const divStyle = { padding: '12px', marginTop: '100px', color: '#2c599d' };
    return (
      <footer style={{ backgroundColor: '#e8e8e8' }}>
        <div style={divStyle} className="ui center aligned container">
            Hawaii H.O.M.E. Project <br />
            Homeless Outreach & Medical Education<br />
          <hr />
          <a href="https://sites.google.com/view/hawaiihomeproject/about?authuser=0"> Learn more </a>
        </div>
      </footer>
    );
  }
}

export default Footer;
