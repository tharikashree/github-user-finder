import logo from './logo.svg';
import './App.css';
import { useMemo, useState, useEffect } from 'react';
import { Avatar, Button, Tab, TabNavigation, Table, TextInput,Switch} from 'evergreen-ui';

function App() {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState({});
  const [followers, setFollowers] = useState([]);
  const [repo, setRepo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const tabs = useMemo(() => ['Followers', 'Repositories'], []);

  const searchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://api.github.com/search/users?q=" + username);
      const data = await res?.json();
      setProfile(data?.items[0]);
      getFollowers(data?.items[0]);
      getRepo(data?.items[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getFollowers = async (profile) => {
    try {
      const res = await fetch(profile?.followers_url);
      const data = await res?.json();
      setFollowers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const getRepo = async (profile) => {
    try {
      const res = await fetch(profile?.repos_url);
      const data = await res?.json();
      setRepo(data);
    } catch (e) {
      console.error(e);
    }
  };

  // Effect to apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  return (
    <div className="App">
      <h1>Search Github Profile</h1>
      <TextInput onChange={(e) => setUsername(e.target.value)} value={username} />
      <Button marginRight={16} marginTop={13} appearance="primary" onClick={searchProfile} isLoading={loading} disabled={loading}>
        Search
      </Button>
      <div style={{ margin: '20px 0' }}>
        <Switch
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
          label="Toggle Dark Mode"
        />
      </div>


      {profile?.login && (
        <div style={{ marginTop: 30 , textAlign: 'center'}}>
          <Avatar src={profile?.avatar_url} name={profile?.login} size={40} />
          <h3>{profile?.login}</h3>
          <TabNavigation>
            {tabs.map((tab, index) => (
              <Tab
                key={tab}
                isSelected={selectedIndex === index}
                onSelect={() => setSelectedIndex(index)}
              >
                {tab}
              </Tab>
            ))}
          </TabNavigation>

          {selectedIndex === 0 && (
            <div>
              <h2>Followers</h2>
              <Table width={800} style={{ margin: '0 auto' }}>
                <Table.Head>
                  <Table.TextHeaderCell>Avatar</Table.TextHeaderCell>
                  <Table.TextHeaderCell>Username</Table.TextHeaderCell>
                  <Table.TextHeaderCell>Visit</Table.TextHeaderCell>
                </Table.Head>
                <Table.Body height={'auto'}>
                  {followers?.map((p) => (
                    <Table.Row key={p.id}>
                      <Table.TextCell>
                        <Avatar src={p?.avatar_url} name={p?.login} size={40} />
                      </Table.TextCell>
                      <Table.TextCell>{p.login}</Table.TextCell>
                      <Table.TextCell><a href={"https://github.com/" + p?.login}>Visit Profile</a></Table.TextCell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}

          {selectedIndex === 1 && (
            <div>
              <h2>Repositories</h2>
              <Table width={800} style={{ margin: '0 auto' }}>
                <Table.Head>
                  <Table.TextHeaderCell>Repo Name</Table.TextHeaderCell>
                  <Table.TextHeaderCell>Description</Table.TextHeaderCell>
                  <Table.TextHeaderCell>Link</Table.TextHeaderCell>
                </Table.Head>
                <Table.Body height={'auto'}>
                  {repo?.map((p) => (
                    <Table.Row key={p.id}>
                      <Table.TextCell>{p?.name}</Table.TextCell>
                      <Table.TextCell>{p?.description?.length ? p?.description : 'N/A'}</Table.TextCell>
                      <Table.TextCell><a href={p?.html_url}>View Repo</a></Table.TextCell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
