import * as jwt from 'jsonwebtoken';

// Payload with tenantid and branchid
const payload = {
  tenantid: '0e0e19b8-7a60-40f9-bac5-234e84d0bda1',
  branchid: '116103c8-c380-4b13-9ee7-a0c4bb2b7c7f',
};

// Secret key (Use environment variable in production)
const secretKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0ODUxNDA5ODQsImlhdCI6MTQ4NTEzNzM4NCwiaXNzIjoiYWNtZS5jb20iLCJzdWIiOiIyOWFjMGMxOC0wYjRhLTQyY2YtODJmYy0wM2Q1NzAzMThhMWQiLCJhcHBsaWNhdGlvbklkIjoiNzkxMDM3MzQtOTdhYi00ZDFhLWFmMzctZTAwNmQwNWQyOTUyIiwicm9sZXMiOltdfQ.Mp0Pcwsz5VECK11Kf2ZZNF_SMKu5CgBeLN9ZOP04kZo';

// Token options (Explicitly set the algorithm type)
const options: jwt.SignOptions = {
  algorithm: 'HS256', // Ensure TypeScript recognizes this
  expiresIn: '1h', // Token expires in 1 hour
};

// Generate JWT token
const token = jwt.sign(payload, secretKey, options);

console.log('Generated JWT Token:', token);
