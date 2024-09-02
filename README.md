# IMAI_front_end
##  Running front-end for Web UI

### 1. Open new empty terminal on local machine
### 2. Connect to Remote Server
```bash
ssh -L 3000:127.0.0.1:3000 rikaian@35.213.136.241
```
Enter remote server password
### 3. Start back-end server for Web UI
```bash
cd /mnt/data1/webapp_phase_d/imai_webapp
npm run dev
```

### Access Web UI from URL
Open a web browser on your local machine and navigate to http://localhost:3001/login.
If user don't have an account, then he/she need to sign up first by clicking on SignUp.
Once account creation is successful, user can login through login page.
Once login successful, page is redirected to http://localhost:3001/user-routes/dashboard. User can select alert email file from the form field provided and click on submit to get further results.

After testing complete run "ctrl+c" from all local terminal and then "exit"


**Note:**
Currently redmine url is configured on 'origin1' and 'http' protocol. This configuration can be changed from .env file by changing 'REDMINE_HOST' and 'REDMINE_HTTP_PROTOCOL' variable values to required one.
Example: 
REDMINE_HOST='origin1'
REDMINE_HTTP_PROTOCOL='http'
will generate url like 'http://origin1/projects/manpyo-op/wiki/CPU使用率閾値超過'

**Note:**
If on running the server if you get like port 3001 (or other) is already in use the you can use following command to kill the process first and then run the server again.
```bash
sudo kill -9 `sudo lsof -t -i:3001` (just replace the port number)
```
**Please ignore the steps below, they are for development.**

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

### Frontend

`REACT_APP_BACKEND_URL=http://127.0.0.1:3000` - The URL of the backend server.


#### Please follow steps from README.md in IMAI PhaseD Repository
