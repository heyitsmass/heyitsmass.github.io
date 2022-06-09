import requests
import json 
import tempfile 
import os


__OAUTH_TOKEN__ = ''

def get_repos(username): 

  repos_url = f'https://api.github.com/users/{username}/repos'

  repos = json.loads(requests.get(repos_url, auth=('user', __OAUTH_TOKEN__) if __OAUTH_TOKEN__ else None).content)  

  return [(repo["name"], get_num_commits(username, repo)) for repo in repos]



def get_num_commits(username, repo): 
  commits_url =  f'https://api.github.com/repos/{username}/{repo["name"]}/stats/contributors'

  tmp = requests.get(commits_url, auth=('user', __OAUTH_TOKEN__) if __OAUTH_TOKEN__ else None) 

  return json.loads(tmp.content)[0]["total"] if tmp.status_code == 200 else 0


def setAuth(): 
  __TOKEN_PATH__ = os.path.join(tempfile.gettempdir())

  if not os.path.isdir(__TOKEN_PATH__): 
    os.mkdir(__TOKEN_PATH__)   

  __TOKEN_PATH__ = os.path.join(__TOKEN_PATH__, 'githubOAuth.token') 

  if os.path.isfile(__TOKEN_PATH__): 
    with open(__TOKEN_PATH__, 'r') as in_file: 
      __OAUTH_TOKEN__ = in_file.read() 
      

  else: 
    __OAUTH_TOKEN__ = input('Enter OAuth (optional): ')

    if __OAUTH_TOKEN__: 
      with open(__TOKEN_PATH__, 'w') as out_file: 
        out_file.write(__OAUTH_TOKEN__)  



