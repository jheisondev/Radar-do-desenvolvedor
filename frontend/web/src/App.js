import React, { useEffect, useState } from 'react';
import api from './services/api';

import './global.css';
import './app.css';
import './sidebar.css';
import './main.css';
import './nav.css';

import logo from './assets/logo.png';
import git from './assets/git.png';

// Componete: Bloco isolado de HTML, CSS e JS, o qual não interfere no restante da aplicação.
// Estado: Informações mantidas pelos componentes. 
// Propriedade: Informações que um componente pai passa passa para o componente filho.

function App() {

  const [github_username, setGithub_username] = useState('');
  const [techs, setTechs] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [devs, setDevs] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude } = position.coords;

        setLatitude(latitude);
        setLongitude(longitude);

      },
      (err) => {
        console.log(err);
      },
      {
        timeout: 30000,
      }
    )
  }, []);

  useEffect(() => {
    async function loadDevs() {
      const response = await api.get('/devs');

      setDevs(response.data);
    }

    loadDevs();
  }, []);

  async function handleAddDev(e) {
    e.preventDefault();

    const response = await api.post('/devs', {
      github_username,
      techs,
      latitude,
      longitude,
    })

    setGithub_username('');
    setTechs('');

    setDevs([...devs, response.data]);
  }
  
  return (
    <div id="app">
      <nav>
        <img className="git" src={git} alt=""/>
        <img className="logo" src={logo} alt="logo"/>
        <h1 className="title">Radar do desenvolvedor</h1>
      </nav> 
      <div className="aside-main">   
        <aside>
          <div>
            <strong className="title">Sing Up</strong>
            <form onSubmit={handleAddDev}>
            <div className="input-block">
              <label htmlFor="github_username">User GitHub</label>
              <input 
                name="github_username" 
                id="github_username"
                autoCapitalize="none" 
                value={github_username} 
                onChange={e => setGithub_username(e.target.value)} 
                required
              />
            </div>
            
            <div className="input-block">
              <label htmlFor="techs">Techs</label>
              <input 
                name="techs" 
                id="techs" 
                value={techs}
                onChange={e => setTechs(e.target.value)} 
                required
              />
            </div>

            <div className="input-group">
              <div className="input-block">
                <label htmlFor="latitude">Latitude</label>
                <input 
                  type="number" 
                  name="latitude" 
                  id="latitude" 
                  value={latitude}
                  onChange={e => setLatitude(e.target.value)} 
                  required
                />
              </div>

              <div className="input-block">
                <label htmlFor="longitude">Longitude</label>
                <input 
                  type="number" 
                  name="longitude" 
                  id="longitude" 
                  value={longitude}
                  onChange={e => setLongitude(e.target.value)} 
                  required
                />
              </div>
            </div>

            <button className="title" type="submit">Save</button>

          </form>
          </div>
        </aside>
        <main>
          <ul>
            {devs.map(dev => (
              <li key={dev._id} className="dev-item">
                <header>
                  <img src={dev.avatar_url} alt={dev.name}/>
                  <div className="user-info">
                    <strong className="title">{dev.name}</strong>
                    <span>{dev.techs.join(', ')}</span>
                  </div>
                </header>
                <p>{dev.bio}</p>
                <a className="title" href={`https://github.com/${dev.github_username}`} 
                  target="_blank" rel="noopener noreferrer">
                    View Profile
                </a>
              </li>
            ))}
          </ul>
          <footer>
            <p>Copyright 2020 - Todos direitos reservados</p>
            <a className="title" href="https://jhsonmac.github.io" 
              target="_blank" 
              rel="noopener noreferrer">
                Jheison Maciel Ines
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
