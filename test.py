import requests 
import json 
import tempfile 

__OAUTH__ = ''


def get_repos(username): 

  ret = list() 

  repos_url = f'https://api.github.com/users/{username}/repos'

  repos = json.loads(requests.get(repos_url, auth=('user', __OAUTH__) if __OAUTH__ else None).content)  

  for repo in repos: 
    ret.append((repo["name"], get_num_commits(username, repo))) 

  return ret 


def get_num_commits(username, repo): 
  commits_url =  f'https://api.github.com/repos/{username}/{repo["name"]}/stats/contributors'

  tmp = requests.get(commits_url, auth=('user', __OAUTH__) if __OAUTH__ else None) 

  return json.loads(tmp.content)[0]["total"] if tmp.status_code == 200 else 0
