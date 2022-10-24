@echo off
cls
set FIFTPATH=C:\Users\Tigr\Documents\TON\toncli\src\
echo %FIFTPATH%

toncli build
echo ==========================================
toncli run_tests >toncli.log 2>toncli.err
show-log.py

more build\dump-suffix.fif >>build\contract.fif
more build\dump-suffix.fif >>build\ton-hack-challenge-bounces.fif
echo ==========================================
toncli fift run build\contract.fif
dump-hex.py build\boc\contract.boc >build\boc\contract.hex
echo ==========================================
toncli fift run build\ton-hack-challenge-bounces.fif
dump-hex.py build\boc\contract.boc >build\boc\ton-hack-challenge-bounces.hex

