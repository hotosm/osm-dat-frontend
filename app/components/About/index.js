/* eslint indent: "off" */

import React, { Component } from 'react'
import { Link } from 'react-router'
import Header from '../Header'
import style from './style.css'
import logo_hot      from '../../assets/logos/hot.png'
import logo_osm      from '../../assets/logos/osm.png'
import logo_mapbox   from '../../assets/logos/mapbox.png'
import logo_redcross from '../../assets/logos/redcross.png'
import logo_gfdrr    from '../../assets/logos/gfdrr.png'
import logo_aws      from '../../assets/logos/aws.png'
import logo_zoondka  from '../../assets/logos/zoondka.png'
import logo_ds       from '../../assets/logos/ds.png'
import logo_knight   from '../../assets/logos/knight.png'

class About extends Component {
  render() {
    return (
    <div>
      <section className="about">
        <article>
          <Header/>
          <h1>Explore How the World is Mapped by OpenStreetMap Contributors</h1>
        </article>
        <article>
          <h2>See OSM Data Over Time</h2>
          <p>This tool lets you analyse interactively how specific <a className="link" href="http://openstreetmap.org">OpenStreetMap</a> features are mapped in a specific region.</p>
          <p>Say, you&apos;d like to know when most of the buildings in a country like Nepal were added. This tool lets you select the geographical region of interest and shows a graph of the mapping activity in the region. You can even select a specific time interval to get the number of touched features in that period, and the map will highlight the matching buildings as well!</p>
        </article>
        <article>
          <h2>Compare OSM Data at Different Points in Time</h2>
          <p>Want to dig even deeper into the data? The <i>Compare Time Periods</i> feature gives you a side by side comparison down to the individual objects level. Use the swiper to switch between the selected dates.</p>
        </article>
        <article>
          <h2>What&apos;s more</h2>
          <p><b>Explore data by mapper experience:</b> Alternatively to the mapping activity over time (recency of edits) view, one can also investigate the data from a <i>editor level of experience</i> point of view: The graph then displays how large the proportion of the objects is that have been contributed by beginners, intermediate level mappers or experienced users.</p>
          <p><b>Hot Projects:</b> Know which <a className="link" href="http://tasks.hotosm.org/">projects</a> of the <a className="link" href="hotosm.org">Humanitarian OpenStreetMap Team</a> influenced the development of the mapping of a region.</p>
        </article>
        <article>
          <h2>Technical Details</h2>
          <p>Head over to the project&apos;s <a className="link" href="https://github.com/hotosm/osm-analytics">github repository</a> for its source code, general information and technical details.</p>
          <p>The data analyzed in this application is <a className="link" href="http://www.openstreetmap.org/copyright">&copy; OpenStreetMap contributors</a> and available under the <a className="link" href="http://opendatacommons.org/licenses/odbl/">ODbL license</a>.</p>
        </article>
        <article>
          <h2>Try it out now!</h2>
          <Link to="/"><button>Get Started</button></Link>
        </article>
      </section>

      <footer className="about">
        <a href="https://hotosm.org/"><img src={logo_hot} style={{height:'65px'}} /></a>
        <a href="https://openstreetmap.org/"><img src={logo_osm} /></a>
        <a href="https://mapbox.com/"><img src={logo_mapbox} style={{height:'100px'}} /></a>
        <a href="http://www.redcross.org/"><img src={logo_redcross} /></a>
        <a href="https://www.gfdrr.org/"><img src={logo_gfdrr} style={{height:'50px'}} /></a>
        <a href="http://aws.amazon.com/what-is-cloud-computing"><img src={logo_aws} /></a>
        <a href="http://zoondka.com/"><img src={logo_zoondka} style={{height:'50px'}} /></a>
        <a href="https://developmentseed.org/"><img src={logo_ds} style={{height:'50px'}} /></a>
        <a href="http://www.knightfoundation.org/"><img src={logo_knight} /></a>
      </footer>
    </div>)
  }
}

export default About
