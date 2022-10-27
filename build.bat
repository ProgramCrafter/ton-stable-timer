@echo off
cls
set FIFTPATH=C:\Users\Tigr\Documents\TON\toncli\src\
echo %FIFTPATH%

toncli build
echo ==========================================
toncli run_tests >toncli.log 2>toncli.err
show-log.py

more build\dump-suffix.fif >>build\multibell-timer.fif
echo ==========================================
toncli fift run build\multibell-timer.fif
dump-hex.py build\boc\contract.boc >build\boc\contract-timer.hex

more build\dump-suffix.fif >>build\multibell-bell.fif
echo ==========================================
toncli fift run build\multibell-bell.fif
dump-hex.py build\boc\contract.boc >build\boc\contract-bell.hex
