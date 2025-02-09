import * as jwt from 'jsonwebtoken';

// Payload with tenantid and branchid
const payload = {
  tenantid: '08f2a935-eeed-4660-8b3d-b989c06b9ecd',
  branchid: '3c07abd9-9041-4ed0-b556-0c3a9ac2865c',
};

// Secret key (Use environment variable in production)
const secretKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0ODUxNDA5ODQsImlhdCI6MTQ4NTEzNzM4NCwiaXNzIjoiYWNtZS5jb20iLCJzdWIiOiIyOWFjMGMxOC0wYjRhLTQyY2YtODJmYy0wM2Q1NzAzMThhMWQiLCJhcHBsaWNhdGlvbklkIjoiNzkxMDM3MzQtOTdhYi00ZDFhLWFmMzctZTAwNmQwNWQyOTUyIiwicm9sZXMiOltdfQ.Mp0Pcwsz5VECK11Kf2ZZNF_SMKu5CgBeLN9ZOP04kZo';

// Token options (Explicitly set the algorithm type)
const options: jwt.SignOptions = {
  algorithm: 'HS256', // Ensure TypeScript recognizes this
  expiresIn: '21d', // Token expires in 1 hour
};

// Generate JWT token
const token = jwt.sign(payload, secretKey, options);

console.log('Generated JWT Token:', token);

/**
 * token 1
 * Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRpZCI6IjBlMGUxOWI4LTdhNjAtNDBmOS1iYWM1LTIzNGU4NGQwYmRhMSIsImJyYW5jaGlkIjoiMTE2MTAzYzgtYzM4MC00YjEzLTllZTctYTBjNGJiMmI3YzdmIiwiaWF0IjoxNzM4NDEzNTQxLCJleHAiOjE3NDAyMjc5NDF9.a66tu0NFYfFI7ho0OkPa5cXhb7O7qXMIfe092Nk6Hgo
 */

/**
 * token 2
 * Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRpZCI6IjA4ZjJhOTM1LWVlZWQtNDY2MC04YjNkLWI5ODljMDZiOWVjZCIsImJyYW5jaGlkIjoiM2MwN2FiZDktOTA0MS00ZWQwLWI1NTYtMGMzYTlhYzI4NjVjIiwiaWF0IjoxNzM5MTQzMTI0LCJleHAiOjE3NDA5NTc1MjR9.eQVCcSgnPwly5s0TxsJZT-h-YOHCkJ86bn8ULVsHaQM
 */
