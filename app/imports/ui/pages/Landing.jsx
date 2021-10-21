import React from 'react';
import { Grid, Image, Menu } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';

/** A simple static component to render some text for the landing page. */
const Landing = () => (
  <Grid id={PAGE_IDS.LANDING} className="landing" verticalAlign='middle' textAlign='center' container>
    <Menu>
      <Grid.Column width={8}>
        <Image width={'450px'} src="/images/aeneas.jpg"/>
      </Grid.Column>
    </Menu>
  </Grid>
);

export default Landing;
