npx ts-node src/index.ts

# Student Registration
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "newuser@example.com",
  "password": "securepassword",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "STUDENT"
}'
// Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6IlNUVURFTlQiLCJpYXQiOjE3NDM1MzY2MTYsImV4cCI6MTc0MzU0MDIxNn0.RvNxCV78qwYfhXPjX8VuW9VJhmMEJVUP3dbXr_aay0s

# Student login
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "newuser@example.com",
  "password": "securepassword"
}'
//Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mywicm9sZSI6IlNUVURFTlQiLCJpYXQiOjE3NDM1MzY2OTQsImV4cCI6MTc0MzU0MDI5NH0.Qb3fU7x9jwVd5kI3FnFHwaVN7VfYYxxXkE8LrYm4bOQ



# Adnin Registration
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "adminuser@example.com",
  "password": "securepassword",
  "firstName": "Admin",
  "lastName": "User",
  "role": "ADMIN"
}'
// Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzQzNTM2OTEzLCJleHAiOjE3NDM1NDA1MTN9.1eklzCi5bWwC-LDoKzCQfAcJg-bGewE3RvBh2e4zKic


# Admin Login

curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "adminuser@example.com",
  "password": "securepassword"
}'

// Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzQzNTM2OTkzLCJleHAiOjE3NDM1NDA1OTN9.pTJPfLPIWUyOfg8aKcvNt9Up71uUkJUopKQDbP3L_8c

# Register an Intsructor

curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "instructor@example.com",
  "password": "securepassword",
  "firstName": "Instructor",
  "lastName": "User",
  "role": "INSTRUCTOR"
}'
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZSI6IklOU1RSVUNUT1IiLCJpYXQiOjE3NDM1MzY3NjMsImV4cCI6MTc0MzU0MDM2M30.987RoFUf3erLgCx31oXGvtdKNuT  kV5uXUxmBZtTJ5S8

# Instructor Login

curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "instructor@example.com",
  "password": "securepassword" # eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsInJvbGUiOiJJTlNUUlVDVE9SIiwiaWF0IjoxNzQzNDY0OTQ5LCJleHAiOjE3NDM0Njg1NDl9.mzbf-l8YjhXET3C05WSe0XKOMMJxyE8JaMlFKnnEanY
}'

// Token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwicm9sZSI6IklOU1RSVUNUT1IiLCJpYXQiOjE3NDM1MzY4NjgsImV4cCI6MTc0MzU0MDQ2OH0.kPAOX4ExAG-90LonwLt0wbaKbQQyEAYH-cMxu_EowGs
