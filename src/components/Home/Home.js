import React from 'react';
import { withOktaAuth } from '@okta/okta-react';
import styles from './Home.module.css';
import { useState, useEffect } from 'react';
import Board from '../Board/Board.component';
import { useOktaAuth } from '@okta/okta-react';
import Typewriter from 'typewriter-effect';
import UniverseBackground from './UniverseBackground/UniverseBackground';
import logo from '../../snake-and-ladder-logo-zip-file/png/logo-no-background.png';

const Home = () => {
  const { authState, oktaAuth } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    if (!authState || !authState.isAuthenticated) {
      // When user isn't authenticated, forget any user info
      setUserInfo(null);
    } else {
      oktaAuth.getUser().then((info) => {
        setUserInfo(info);
      });
    }
  }, [authState, oktaAuth]); // Update if authState changes

  const login = async () => {
    await oktaAuth.signInWithRedirect();
  };

  if (!authState) {
    return <div>Loading...</div>;
  }

  return (
    <UniverseBackground>
      <div className={styles.container}>
        <header className="App-header">
          <div>
            {!authState.isAuthenticated && (
              <>
                <div>
                <img
                className='mb-3'
                alt="logo"
                src={logo}
              />
                </div>
                <div>
                  <h2>Hello Champ</h2>
                  <h5>please login to view the game</h5>
                </div>
                <div>
                  <Typewriter
                    onInit={(typewriter) => {
                      typewriter
                        .typeString(
                          '<br> One click is what it takes to experience all the fun'
                        )
                        .pauseFor(1000)
                        .deleteChars(3)
                        .typeString('Entertainment')
                        .pauseFor(1000)
                        .deleteChars(13)
                        .typeString('Excitement')
                        .pauseFor(1500)
                        .typeString('<br> JOIN NOW')
                        .start();
                    }}
                  />
                </div>
                <div>
                  <button onClick={login} className={styles['glowing-btn']}>
                    <span className={styles['glowing-txt']}>
                      Log
                      <span className={styles['faulty-letter']}>I</span>N
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>

          {authState.isAuthenticated && (
            <div className="App">
              <header className="App-header">
                <Board userInfo={userInfo} />
              </header>
            </div>
          )}
        </header>
      </div>
    </UniverseBackground>
  );
};

export default withOktaAuth(Home);
