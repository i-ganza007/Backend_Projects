const url = 'https://api.themoviedb.org/3/account/22681381';
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZGRmZTM4NzJlNTQxOWVkNTgzOWEyNWU0OTYyZjdkNSIsIm5iZiI6MTc2ODk0MzkyMi42OTcsInN1YiI6IjY5NmZmMTMyZTBjMmM4ZWViMGFiZDQzNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nboSCObZqin_fhSo9-tiO07OV6QQ5K49WqatCQu41Jg'
  }
};

fetch(url, options)
  .then(res => res.json())
  .then(json => console.log(json))
  .catch(err => console.error(err));