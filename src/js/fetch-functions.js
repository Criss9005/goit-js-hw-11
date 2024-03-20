const axios = require('axios').default;
axios.defaults.headers.common['Authorization'] =
  'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5MzlhNjJlYTE5ZmQzZmUwYjhhZGE5NTM4Nzc1ZTZmOSIsInN1YiI6IjY1NzBjOWUwYTc2YWM1MDEzOTA5NzllNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2xkJugkWffi98YAAJOAs6dLpuODWV6jhron_0UeVaJg';

//////////////// Function to select trendig movies of the day.  ///////////////////////////

export async function getTrending(page) {
  const url = 'https://api.themoviedb.org/3/trending/movie/day';
  try {
    const response = await axios.get(url, {
      params: {
        language: 'en-US',
        page,
      },
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.statusText == 'OK') throw new Error('Response Failed');
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}

//////////           Function to search a movie with a string       ///////

export async function fetchBySearch(query, page) {
  const url = 'https://api.themoviedb.org/3/search/movie';
  try {
    const response = await axios.get(url, {
      params: {
        query,
        language: 'en-US',
        page,
      },
      headers: {
        Accept: 'application/json',
      },
    });
    const failText = document.querySelector('.fail-text');

    if (response.data.results.length == 0) {
      failText.style.display = 'block';
    } else {
      failText.style.display = 'none';
    }

    if (!response.statusText == 'OK') throw new Error('Response Failed');
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}

//////////// function to fetch information of an especific movie //////////////////////

export async function fetchById(id) {
  const url = `https://api.themoviedb.org/3/movie/${id}`;
  try {
    const response = await axios.get(url, {
      params: {
        language: 'en-US',
      },
      headers: {
        Accept: 'application/json',
      },
    });
    if (!response.statusText == 'OK') throw new Error('Response Failed');
    const data = response.data;
    return data;
  } catch (error) {
    console.error(error);
  }
}
