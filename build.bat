@echo off
cls
set FIFTPATH=C:\Users\Tigr\Documents\TON\toncli\src\
echo %FIFTPATH%

toncli run_tests >toncli.log 2>toncli.err
show-log.py

echo ==========================================
toncli build
more build\dump-suffix.fif >>build\contract.fif
echo ==========================================
toncli fift run build\contract.fif
dump-hex.py build\boc\contract.boc >build\boc\contract.hex
