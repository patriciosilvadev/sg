@echo off
Copy C:\sg\backend\src\database\db.sqlite D:\backup-sg\db_%time:~0,2%%time:~3,2%%time:~6,2%_%date:~-10,2%%date:~-7,2%%date:~-4,4%.sqlite
pause