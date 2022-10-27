@echo off
cls
set FIFTPATH=C:\Users\Tigr\Documents\TON\toncli\src\
echo %FIFTPATH%

toncli build
echo ==========================================
toncli run_tests >toncli.log 2>toncli.err
show-log.py

rem more build\dump-suffix.fif >>build\multibell.fif
rem echo ==========================================
rem toncli fift run build\multibell.fif
rem dump-hex.py build\boc\contract.boc >build\boc\contract.hex
