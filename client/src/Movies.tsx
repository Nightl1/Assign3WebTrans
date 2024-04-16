import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css'

const MoviesHomePage: React.FC = () => {
    const [movies, setMovies] = useState([]);
    const [favoriteGenre, setFavoriteGenre] = useState('');

    useEffect(() => {
        // fetch movies data from the server
        const fetchMovies = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            try {
                // when deploying, change localhost.
                const response = await fetch('http://localhost:5000/movies', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-header': token
                    },
                });

                if (response.status === 200) {
                    const data = await response.json();
                    console.log('data: ', data);
                    setMovies(data); //fetched the movies data

                    // Take user's fav genre from fetched movies
                    const genres = data.reduce((acc: string[], movie: Record<string, any>) => {
                        movie.genres.forEach((genre: string) => {
                            if (!acc.includes(genre)) {
                                acc.push(genre);
                            }
                        });
                        return acc;
                    }, []);

                    // Take the fav genre registered from the token
                    const favoriteGenre = localStorage.getItem('genre');
                    console.log('favoriteGenre: ', favoriteGenre);
                    if (favoriteGenre && genres.includes(favoriteGenre)) {
                        setFavoriteGenre(favoriteGenre);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchMovies();
    }, []);

    // logout and go to log in again
    const handleLogout = () => {
        localStorage.removeItem('token'); // wil clear token from local storage
        localStorage.removeItem('favoriteGenre'); // clear the fav genre from local storage
        // setIsLoggedIn(false);
        window.location.href = '/Part2'; // redirect to login page
    };
    console.log(movies)

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className='col'>
                        <button className="btn btn-secondary text-light" onClick={handleLogout}>Log out</button>
                    </div>
                </div>
 
                <div className="row">
                    <div className="col">
                        <h3 className='movieLabel'>Movies List: </h3>
                    </div>
                </div>
 
                <div className="row">
                    {/* {favoriteGenre && ( */}
                        <div className="col">
                            <h2 className='movieLabel'>Your favorite genre: {favoriteGenre}</h2>
                        </div>
                    {/* )} */}
                </div>


                <div className="row">
                    {movies.map((movie: Record<string, any>, index) => (
                        <div className="col-md-4" key={index}>
                            <div className="card">
                                <img src={movie.poster} className="card-img-top" alt={movie.title} style={{ maxWidth: '100%', maxHeight: '300px' }} />
                                <div className="card-body">
                                    <h5 className="card-title">{movie.title}</h5>
                                    <p className="card-text">{movie.plot}</p>
                                    <button className="btn btn-primary">Go somewhere</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );
}

export default MoviesHomePage;
