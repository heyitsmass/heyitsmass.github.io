const repoURL = `https://api.github.com/users/heyitsmass/repos`; 

let repoHTTP = new XMLHttpRequest(); 

repoHTTP.open("GET", repoURL, true); 

repoHTTP.onload = function(){ 
  if(repoHTTP.status == 200){ 
    const repoData = JSON.parse(repoHTTP.response); 
    for(i in repoData){ 
      let repoName = repoData[i]["name"]; 
      const commitsURL = `https://api.github.com/repos/heyitsmass/${repoName}/stats/contributors`;

      let commitsHTTP = new XMLHttpRequest(); 
      let numCommits = 0; 

      commitsHTTP.open("GET", commitsURL, true); 

      commitsHTTP.onload = function(){ 
        if(this.status == 200){ 
          const commitsData = JSON.parse(this.response); 

          for(j in commitsData)
            numCommits = numCommits + commitsData[j]["total"]; 
          
        }

        console.log(repoName, numCommits); 
        
        const para = document.createElement("p"); 
        const text = document.createTextNode(repoName + ": " + numCommits); 

        para.appendChild(text); 

        const repoDiv = document.getElementById("repoDiv"); 

        repoDiv.append(para);  

      }

      commitsHTTP.send(); 
    }
  }
}

repoHTTP.send(); 