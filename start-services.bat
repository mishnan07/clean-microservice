@echo off
echo Starting Clean Architecture Microservices...

echo.
echo Starting Docker services (MongoDB and RabbitMQ)...
docker-compose up -d

echo.
echo Waiting for services to start...
timeout /t 10

echo.
echo Installing dependencies...
cd user-service
call npm install
cd ..\admin-service
call npm install
cd ..\shared
call npm install
cd ..

echo.
echo Seeding admin user...
cd admin-service
call npm run seed
cd ..

echo.
echo Starting User Service on port 3001...
start "User Service" cmd /k "cd user-service && npm run dev"

echo.
echo Starting Admin Service on port 3002...
start "Admin Service" cmd /k "cd admin-service && npm run dev"

echo.
echo All services started!
echo User Service: http://localhost:3001
echo Admin Service: http://localhost:3002
echo RabbitMQ Management: http://localhost:15672 (admin/password)
echo.
echo Press any key to exit...
pause