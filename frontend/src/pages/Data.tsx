import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    email: string;
    birth_date: string;
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
    about_me: string;
}

export default function Data() {
    const [user, setUser] = useState<User[]>([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/users/?format=json')
            .then((response) => setUser(response.data))
            .catch((error) => console.error('Error fetching data: ', error));
    }, []);

    return (<div>
        <h1>Data</h1>
        <table>
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Birth date</th>
                    <th>Street address</th>
                    <th>City</th>
                    <th>State</th>
                    <th>Zip code</th>
                    <th>About me</th>
                </tr>
            </thead>
            <tbody>
                {user.map((item) => (
                    <tr key={item.email}>
                        <td>{item.email}</td>
                        <td>{item.birth_date}</td>
                        <td>{item.street_address}</td>
                        <td>{item.city}</td>
                        <td>{item.state}</td>
                        <td>{item.zip_code}</td>
                        <td>{item.about_me}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>);
};
