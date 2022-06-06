//const commits_url = 'https://api.github.com/repos/heyitsmass/eight-queens/stats/contributors';
//const repos_url = 'https://api.github.com/user/heyitsmass/repos';

function requestUserRepos(username){ 
  const repos_req = new XMLHttpRequest(); 

  const repos_url = `https://api.github.com/user/${username}/repos`; 

  //repos_req.open('GET', repos_url); 

  repos_req.send(); 

  repos_req.onload = function(){ 
    const data = JSON.parse(this.response); 

    console.log(data); 

  }
  
}