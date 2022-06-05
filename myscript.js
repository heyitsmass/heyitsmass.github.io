function requestUserRepos(username){ 
  const xmlreq = new XMLHttpRequest(); 

  const url = 'https://api.github.com/users/${username}/repos';

  xmlreq.open('GET', url, true);

  xmlreq.onload = function(){
    const data = JSON.parse(this.response); 

    console.log(data) 

  }

  xmlreq.send()
}
