import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface UserData {
  [key: string]: string | { [key: string]: string };
}

const renderForms = (components: string[], userData: UserData, setUserData: React.Dispatch<React.SetStateAction<UserData>>) => {
  return components.map((comp) => {
    switch (comp) {
      case 'About me':
        return (
          <div key={comp}>
            <label>{comp}</label>
            <textarea
              onChange={(e) => setUserData({ ...userData, 'about_me': e.target.value })}
              placeholder="Tell us about yourself"
            />
          </div>
        );
      case 'Birth date':
        return (
          <div key={comp}>
            <label>Birth date</label>
            <input
              type="date"
              onChange={(e) => setUserData({ ...userData, 'birth_date': e.target.value })}
            />
          </div>
        );
      case 'Address':
        const address = userData['Address'] as { [key: string]: string } | undefined;
        return (
          <div key={comp}>
            <label>{comp}</label>
            <div>
              <input
                type="text"
                onChange={(e) => {
                  setUserData({
                    ...userData,
                      ...(address || {}),
                      street_address: e.target.value,
                    
                  });
                }}
                placeholder="Street Address"
              />
            </div>
            <div>
              <input
                type="text"
                onChange={(e) => {
                  setUserData({
                    ...userData,
                      ...(address || {}),
                      city: e.target.value,
                    
                  });
                }}
                placeholder="City"
              />
            </div>
            <div>
              <input
                type="text"
                onChange={(e) => {
                  setUserData({
                    ...userData,
                      ...(address || {}),
                      state: e.target.value,
                    
                  });
                }}
                placeholder="State"
              />
            </div>
            <div>
              <input
                type="text"
                onChange={(e) => {
                  setUserData({
                    ...userData,
                      ...(address || {}),
                      zip_code: e.target.value,
                    
                  });
                }}
                placeholder="Zip Code"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  });
};

export const Page1 = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/auth-users/', {
        username: email,
        password,
      });

      const userUrl = response.data.url;
      const userEmail = response.data.username;

      const response2 = await axios.post('http://localhost:8000/api/users/', {
        user: userUrl,
        email: userEmail,
      });

      const url = response2.data.url;

      localStorage.setItem('onboardingUser', JSON.stringify({ email: userEmail, user: userUrl, url: url }));

      navigate('/page2');
    } catch (error) {
      console.error('Error creating user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Page 1: Create User</h1>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Email (Username)</label>
          <input type="email" value={email} onChange={handleEmailChange} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <button type="submit">Create User</button>
      </form>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export const Page2 = () => {
  const [userData, setUserData] = useState<UserData>(JSON.parse(localStorage.getItem('onboardingUser') || '{}'));
  const [page2Components, setPage2Components] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPage2Components = async () => {
      try {
        const page2Response = await axios.get('http://localhost:8000/api/pages/2/?format=json');
        const page2Data = page2Response.data.components || [];
        setPage2Components(page2Data);
      } catch (error) {
        console.error('Error fetching Page 2 components:', error);
      }
    };

    fetchPage2Components();
  }, []);

  const handlePage2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = { ...userData };

    try {
      localStorage.setItem('onboardingUser', JSON.stringify(data));
      const url = typeof data["url"] === "string" ? data["url"] : "";

      if (!url) {
        throw new Error("User URL is invalid or missing.");
      }

      await axios.put(url, data);

      navigate('/page3');
    } catch (error) {
      console.error('Error saving Page 2 data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Page 2: Additional Information</h1>
      <form onSubmit={handlePage2Submit}>
        {renderForms(page2Components, userData, setUserData)}
        <button type="submit">Save and Go to Page 3</button>
      </form>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export const Page3 = () => {
  const [userData, setUserData] = useState<UserData>(JSON.parse(localStorage.getItem('onboardingUser') || '{}'));
  const [page3Components, setPage3Components] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPage3Components = async () => {
      try {
        const page3Response = await axios.get('http://localhost:8000/api/pages/3/?format=json');
        const page3Data = page3Response.data.components || [];
        setPage3Components(page3Data);
      } catch (error) {
        console.error('Error fetching Page 3 components:', error);
      }
    };

    fetchPage3Components();
  }, []);

  const handlePage3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = { ...userData };

    try {
      localStorage.setItem('onboardingUser', JSON.stringify(data));

      const url = typeof data["url"] === "string" ? data["url"] : "";

      if (!url) {
        throw new Error("User URL is invalid or missing.");
      }

      await axios.put(url, data);

      alert('Onboarding completed!');
      navigate('/data');
    } catch (error) {
      console.error('Error saving Page 3 data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Page 3: Final Information</h1>
      <form onSubmit={handlePage3Submit}>
        {renderForms(page3Components, userData, setUserData)}
        <button type="submit">Complete Onboarding</button>
      </form>
      {loading && <p>Loading...</p>}
    </div>
  );
};
