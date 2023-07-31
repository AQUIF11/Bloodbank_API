# Bloodbank_API
Bloodbank API developed using node-js(express+mongodb). The Application is configured for both development and production deployments. Refer to config folder to check which environment variables need to be set for production deployment.

## Requests served by the API(with request format)

1. Signup Hospital User(Public End-Point):
   - URL : http://localhost:3000/hospital/signup
   - METHOD : PUT
   - BODY :
   ```json
   {
    "email": "hospital1@gmail.com",
    "password": "alpha",
    "name": "hospital1"
   }
   ```

2. Login Hospital User(Public End-Point):
   - URL : http://localhost:3000/hospital/login
   - METHOD : POST
   - BODY :
   ```json
   {
    "email": "hospital1@gmail.com",
    "password": "alpha"
   }
   ```
   
3. Signup Receiver User(Public End-Point):
   - URL : http://localhost:3000/receiver/signup
   - METHOD : PUT
   - BODY :
   ```json
   {
    "email": "receiver1@gmail.com",
    "password": "aplha",
    "name": "receiver1",
    "bloodGroup": "b+"
   }
   ```
   
4. Login Receiver User(Public End-Point):
   - URL : http://localhost:3000/receiver/login
   - METHOD : POST
   - BODY : 
   ```json
   {
    "email": "receiver1@gmail.com",
    "password": "aplha"
   }
   ```
   
5. Add Blood Sample(Only accessible to hospital users):
   - URL : http://localhost:3000/hospital/bloodsample
   - METHOD : POST
   - HEADER : Authorization = Bearer Token
   - BODY : 
   ```json
   {
    "bloodGroup": "ab-"
   }
   ```
   
6. Update Blood Sample(Only accessible to hospital users):
   - URL : http://localhost:3000/hospital/bloodsample/:sampleId
   - METHOD : PUT
   - HEADER : Authorization = Bearer Token
   - BODY : 
   ```json
   {
    "bloodGroup": "o+"
   }
   ```
   
7. Delete Blood Sample(Only accessible to hospital users):
   - URL : http://localhost:3000/hospital/bloodsample/:sampleId
   - METHOD : DELETE
   - HEADER : Authorization = Bearer Token
   
8. Get Blood Samples Uploaded By Hospital(Only accessible to hospital users):
   - URL : http://localhost:3000/hospital/bloodsamples
   - METHOD : GET
   - HEADER : Authorization = Bearer Token
   
9. Request a Blood Sample(Only accessible to receiver users):
   - URL : http://localhost:3000/receiver/bloodsample
   - METHOD : POST
   - HEADER : Authorization = Bearer Token
   
10. Get List of Requests Made For a Particular Blood Group to a Hospital(Only accessible to hospital users):
    - URL : http://localhost:3000/hospital/sample-requests/:bloodGroup
    - METHOD : GET
    - HEADER : Authorization = Bearer Token
    
11. Get List of All the Blood Samples Available in All the Hospitals(Public End-Point):
    - URL : http://localhost:3000/public/bloodsamples
    - METHOD : GET
